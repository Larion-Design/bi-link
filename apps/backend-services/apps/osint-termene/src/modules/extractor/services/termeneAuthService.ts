import { BrowserService } from '@app/browser-module/browserService'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Page } from 'puppeteer-core'

@Injectable()
export class TermeneAuthService {
  private readonly loginPage = 'https://termene.ro/autentificare'
  private readonly email: string
  private readonly password: string

  constructor(private readonly browserService: BrowserService, configService: ConfigService) {
    this.email = configService.getOrThrow<string>('SCRAPER_TERMENE_EMAIL')
    this.password = configService.getOrThrow<string>('SCRAPER_TERMENE_PASSWORD')
  }

  authenticate = async () =>
    this.browserService.handlePage(async (page) => {
      await page.goto(this.loginPage)
      await page.waitForNavigation()

      if (this.isUserAuthenticated(page)) {
        await page.waitForSelector('#login-form')
        await page.focus('#emailOrPhone')
        await page.keyboard.type(this.email, { delay: this.getRandomDelay(100, 200) })

        await page.focus('#password')
        await page.keyboard.type(this.password, { delay: this.getRandomDelay(100, 200) })

        await Promise.all([page.waitForNavigation(), page.click('#loginBtn')])
        await page.waitForNetworkIdle()
      }
    })

  isUserAuthenticated = (page: Page) => page.url() !== this.loginPage

  private getRandomDelay = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min)
}
