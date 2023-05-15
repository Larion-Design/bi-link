import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Page } from 'puppeteer-core'

@Injectable()
export class TermeneScraperService {
  private readonly loginPage = 'https://termene.ro/autentificare'
  private readonly email: string
  private readonly password: string

  constructor(configService: ConfigService) {
    this.email = configService.getOrThrow('SCRAPER_TERMENE_EMAIL')
    this.password = configService.getOrThrow('SCRAPER_TERMENE_PASSWORD')
  }

  authenticate = async (page: Page) => {
    await page.goto(this.loginPage)
    await page.waitForNavigation()

    if (page.url() === this.loginPage) {
      await page.waitForSelector('#login-form')
      await page.focus('#emailOrPhone')
      await page.keyboard.type(this.email, { delay: this.getRandomDelay(100, 200) })

      await page.focus('#password')
      await page.keyboard.type(this.password, { delay: this.getRandomDelay(100, 200) })

      await Promise.all([page.waitForNavigation(), page.click('#loginBtn')])
    }
  }

  private getRandomDelay = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min)
}
