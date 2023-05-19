import { BrowserService } from '@app/browser-module/browserService'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TermeneAuthService {
  private readonly loginPage = 'https://termene.ro/autentificare'
  private readonly email: string
  private readonly password: string

  constructor(private readonly browserService: BrowserService, configService: ConfigService) {
    this.email = configService.getOrThrow('SCRAPER_TERMENE_EMAIL')
    this.password = configService.getOrThrow('SCRAPER_TERMENE_PASSWORD')
  }

  authenticate = async () => {
    const browser = await this.browserService.getBrowser()
    const page = await browser.newPage()

    await page.goto(this.loginPage)
    await page.waitForNavigation()

    if (page.url() === this.loginPage) {
      await page.waitForSelector('#login-form')
      await page.focus('#emailOrPhone')
      await page.keyboard.type(this.email, { delay: this.getRandomDelay(100, 200) })

      await page.focus('#password')
      await page.keyboard.type(this.password, { delay: this.getRandomDelay(100, 200) })

      await Promise.all([page.waitForNavigation(), page.click('#loginBtn')])
      await page.waitForNetworkIdle()
    }
    await page.close()
  }

  private getRandomDelay = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min)
}
