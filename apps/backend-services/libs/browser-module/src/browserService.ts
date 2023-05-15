import { Injectable } from '@nestjs/common'
import puppeteer, { Browser } from 'puppeteer-core'

@Injectable()
export class BrowserService {
  private browser: Browser | undefined

  getBrowser = async () => {
    if (!this.browser) {
      this.browser = await puppeteer.connect({
        browserWSEndpoint: `${process.env.CHROMIUM_INSTANCE_URL}?keepalive=60000&stealth`,
      })
    }
    return this.browser
  }
}
