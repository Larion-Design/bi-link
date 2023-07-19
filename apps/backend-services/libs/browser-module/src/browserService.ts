import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import puppeteer, { Browser, BrowserContext, Page, ResourceType } from 'puppeteer-core'

type PageOptions = {
  blockResources?: ResourceType[]
  disableJavascript?: boolean
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

  async execBrowserSession<T>(
    sessionHandler: (browser: BrowserContext) => Promise<T>,
    privateSession = false,
  ) {
    const browser = await this.getBrowser()

    try {
      const context = privateSession
        ? await browser.createIncognitoBrowserContext()
        : browser.defaultBrowserContext()

      try {
        const result = await sessionHandler(context)
        await this.closeContext(context)
        return result
      } catch (e) {
        await this.closeContext(context)
        throw e
      }
    } catch (e) {
      if (browser.isConnected()) {
        browser.disconnect()
      }
      this.logger.error(e)
      throw e
    }
  }

  private async getBrowser() {
    if (!this.browser || !this.browser.isConnected()) {
      this.browser = await puppeteer.connect({
        browserWSEndpoint: `${this.chromiumInstanceUrl}?keepalive=60000&stealth`,
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
      if (options?.blockResources) {
        await this.blockRedundantResources(page, options.blockResources)
      }
      if (options?.disableJavascript) {
        await page.setJavaScriptEnabled(false)
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
      if (
        request.method().toUpperCase() === 'GET' &&
        blockedResources.includes(request.resourceType())
      ) {
        return request.abort()
      }
      return request.continueRequestOverrides()
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
