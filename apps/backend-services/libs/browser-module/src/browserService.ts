import { Injectable } from '@nestjs/common'
import puppeteer, { Browser, Page } from 'puppeteer-core'

@Injectable()
export class BrowserService {
  private browser: Browser | undefined

  getBrowser = async () => {
    if (!this.browser) {
      this.browser = await puppeteer.connect({
        browserWSEndpoint: `${String(process.env.CHROMIUM_INSTANCE_URL)}?keepalive=60000&stealth`,
      })
    }
    return this.browser
  }

  handlePage = async <T = void>(pageHandler: (page: Page) => Promise<T>) => {
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
    }
    return Promise.reject()
  }

  handlePrivatePage = async <T = void>(pageHandler: (page: Page) => Promise<T>) => {
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
    }
    return Promise.reject()
  }
}
