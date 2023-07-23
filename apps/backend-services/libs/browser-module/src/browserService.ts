import { PersistentCookiesService } from '@app/browser-module/persistentCookiesService'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import puppeteer, { Browser, BrowserContext, Page, ResourceType } from 'puppeteer-core'

type PageOptions = {
  blockResources?: ResourceType[]
  disableJavascript?: boolean
  htmlOnly?: boolean
  enableCache?: boolean
  persistentCookiesKey?: string
}

type BrowserSessionOptions = {
  private?: boolean
  sessionId?: string
}

@Injectable()
export class BrowserService {
  private readonly logger = new Logger(BrowserService.name)
  private readonly chromiumInstanceUrl: string
  private browser: Browser | undefined

  constructor(
    private readonly persistentCookiesService: PersistentCookiesService,
    configService: ConfigService,
  ) {
    this.chromiumInstanceUrl = configService.getOrThrow<string>('CHROMIUM_INSTANCE_URL')
  }

  getRedundantResourceTypes = (): ResourceType[] => [
    'image',
    'stylesheet',
    'font',
    'cspviolationreport',
    'media',
  ]

  private getAllResourceTypesExceptHTML = (): ResourceType[] => [
    'script',
    'media',
    'font',
    'eventsource',
    'image',
    'stylesheet',
    'cspviolationreport',
    'websocket',
    'xhr',
    'manifest',
    'fetch',
    'prefetch',
    'preflight',
    'texttrack',
    'signedexchange',
    'ping',
    'other',
  ]

  async execBrowserSession<T>(
    sessionHandler: (browser: BrowserContext) => Promise<T>,
    options?: BrowserSessionOptions,
  ) {
    const browser = await this.getBrowser(options)
    const context = options?.private
      ? await browser.createIncognitoBrowserContext()
      : browser.defaultBrowserContext()

    try {
      const result = await sessionHandler(context)
      await this.closeContext(context)
      return result
    } catch (e) {
      await this.closeContext(context)
      this.logger.error(e)
    } finally {
      if (browser) {
        await browser.close()
      }
    }
  }

  private async getBrowser(options?: BrowserSessionOptions) {
    if (!this.browser || !this.browser.isConnected()) {
      const url = new URL(this.chromiumInstanceUrl)

      if (options?.sessionId) {
        url.searchParams.set('trackingId', options.sessionId)
      }
      if (options?.private) {
        url.searchParams.set('stealth', '')
      }

      this.browser = await puppeteer.connect({
        browserWSEndpoint: url.toString(),
      })
    }
    return this.browser
  }

  async handlePage<T = void>(
    context: BrowserContext,
    pageHandler: (page: Page) => Promise<T>,
    options?: PageOptions,
  ) {
    const page = await context.newPage()

    try {
      await page.setBypassCSP(true)

      if (options?.disableJavascript) {
        await page.setJavaScriptEnabled(false)
      }
      if (options?.enableCache) {
        await page.setCacheEnabled(true)
      }
      if (options?.persistentCookiesKey) {
        const cookies = await this.persistentCookiesService.retrieveCookies(
          options.persistentCookiesKey,
        )

        if (cookies) {
          await page.setCookie(...cookies)
        }
      }
      if (options?.blockResources?.length) {
        await this.blockRedundantResources(page, options.blockResources)
      } else if (options?.htmlOnly) {
        await this.blockRedundantResources(page, this.getAllResourceTypesExceptHTML())
      }

      const result = await pageHandler(page)

      if (options?.persistentCookiesKey) {
        const cookies = await page.cookies()

        if (cookies?.length) {
          await this.persistentCookiesService.persistCookies(options.persistentCookiesKey, cookies)
        }
      }

      await this.closePage(context, page)
      return result
    } catch (e) {
      await this.closePage(context, page)
      this.logger.error(e)
      throw e
    }
  }

  private async blockRedundantResources(page: Page, blockedResources: ResourceType[]) {
    await page.setRequestInterception(true)
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    page.on('request', (request) => {
      if (!request.isInterceptResolutionHandled()) {
        if (
          request.method().toUpperCase() === 'GET' &&
          blockedResources.includes(request.resourceType())
        ) {
          return request.abort()
        }
        return request.continue()
      }
    })
  }

  private async closePage(context: BrowserContext, page: Page) {
    if (!context.isIncognito() && context.browser().isConnected() && !page.isClosed()) {
      return page.close()
    }
  }

  private async closeContext(context: BrowserContext) {
    if (context.isIncognito() && context.browser().isConnected()) {
      return context.close()
    }
  }
}
