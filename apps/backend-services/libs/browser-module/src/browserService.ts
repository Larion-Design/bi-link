import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import puppeteer, { Browser, Page } from 'puppeteer-core'

@Injectable()
export class BrowserService {
  private browser: Browser | undefined
  private readonly chromiumInstanceUrl: string

  constructor(configService: ConfigService) {
    this.chromiumInstanceUrl = configService.getOrThrow<string>('CHROMIUM_INSTANCE_URL')
  }

  async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.connect({
        browserWSEndpoint: `${this.chromiumInstanceUrl}?keepalive=60000&stealth`,
      })
    }
    return this.browser
  }

  async handlePage<T = void>(pageHandler: (page: Page) => Promise<T>) {
    const browser = await this.getBrowser()
    const page = await browser.newPage()

    try {
      const result = await pageHandler(page)

      if (page.isClosed()) {
        await page.close()
      }
      return result
    } catch (e) {
      if (page.isClosed()) {
        await page.close()
      }
      return Promise.reject(e)
    }
  }

  async handlePrivatePage<T = void>(pageHandler: (page: Page) => Promise<T>) {
    const browser = await this.getBrowser()
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()

    try {
      const result = await pageHandler(page)

      if (page.isClosed()) {
        await page.close()
      }
      return result
    } catch (e) {
      if (page.isClosed()) {
        await page.close()
      }
      return Promise.reject(e)
    }
  }
}
