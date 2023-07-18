import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import puppeteer, { Browser, Page, ResourceType } from 'puppeteer-core'
import { async } from 'rxjs'

@Injectable()
export class BrowserService {
  private readonly logger = new Logger(BrowserService.name)

  private readonly chromiumInstanceUrl: string

  constructor(configService: ConfigService) {
    this.chromiumInstanceUrl = configService.getOrThrow<string>('CHROMIUM_INSTANCE_URL')
  }

  async execBrowserSession<T>(sessionHandler: (browser: Browser) => Promise<T>) {
    const browser = await this.getBrowser()

    try {
      const result = await sessionHandler(browser)

      if (browser.isConnected()) {
        browser.disconnect()
      }
      return result
    } catch (e) {
      if (browser.isConnected()) {
        browser.disconnect()
      }
      return Promise.reject(e)
    }
  }

  getBrowser = async () =>
    puppeteer.connect({
      browserWSEndpoint: `${this.chromiumInstanceUrl}?keepalive=60000&stealth`,
    })

  async handlePage<T = void>(browser: Browser, pageHandler: (page: Page) => Promise<T>) {
    const page = await browser.newPage()

    await this.blockRedundantResources(page)

    try {
      const result = await pageHandler(page)

      if (!page.isClosed()) {
        await page.close()
      }
      return result
    } catch (e) {
      if (!page.isClosed()) {
        await page.close()
      }
      return Promise.reject(e)
    }
  }

  async handlePrivatePage<T = void>(browser: Browser, pageHandler: (page: Page) => Promise<T>) {
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()

    await this.blockRedundantResources(page)

    try {
      const result = await pageHandler(page)

      if (!page.isClosed()) {
        await page.close()
      }
      return result
    } catch (e) {
      if (!page.isClosed()) {
        await page.close()
      }
      return Promise.reject(e)
    }
  }

  private async blockRedundantResources(page: Page) {
    const resourceTypes = new Set<ResourceType>([
      'image',
      'stylesheet',
      'font',
      'cspviolationreport',
      'media',
    ])

    await page.setRequestInterception(true)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    page.on('request', (request) => {
      if (resourceTypes.has(request.resourceType())) {
        return request.abort()
      }
      return request.continue()
    })
  }
}
