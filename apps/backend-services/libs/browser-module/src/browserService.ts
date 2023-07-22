import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import e from 'express'
import puppeteer, { Browser, BrowserContext, Page, ResourceType } from 'puppeteer-core'

type PageOptions = {
  blockResources?: ResourceType[]
  disableJavascript?: boolean
  htmlOnly?: boolean
}

@Injectable()
export class BrowserService {
  private readonly logger = new Logger(BrowserService.name)
  private readonly chromiumInstanceUrl: string
  private browser: Browser | undefined

  constructor(configService: ConfigService) {
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
    privateSession = false,
  ) {
    const browser = await this.getBrowser()
    const context = browser.defaultBrowserContext()

    browser.on('disconnected', () => console.debug('browser crashed or disconnected.'))

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

  private async getRemoteBrowser() {
    return puppeteer.connect({
      browserWSEndpoint: this.chromiumInstanceUrl,
    })
  }

  private async getBrowser() {
    if (!this.browser || !this.browser.isConnected()) {
      console.debug('connecting to browser')
      this.browser = await puppeteer.connect({
        browserWSEndpoint: this.chromiumInstanceUrl,
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
      if (options?.disableJavascript) {
        await page.setJavaScriptEnabled(false)
      }
      if (options?.blockResources?.length) {
        await this.blockRedundantResources(page, options.blockResources)
      } else if (options?.htmlOnly) {
        await this.blockRedundantResources(page, this.getAllResourceTypesExceptHTML())
      }

      const result = await pageHandler(page)
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
