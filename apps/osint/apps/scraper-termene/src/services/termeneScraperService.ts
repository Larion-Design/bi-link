import { Injectable } from '@nestjs/common'
import { Page } from 'puppeteer-core'

@Injectable()
export class TermeneScraperService {
  authenticate = async (page: Page) => {
    const loginPage = 'https://termene.ro/autentificare'

    await page.goto(loginPage)

    if (page.url() === loginPage) {
      await page.waitForSelector('#login-form')
      await page.focus('#emailOrPhone')
      await page.keyboard.type(process.env.SCRAPER_TERMENE_EMAIL, {
        delay: this.getRandomDelay(100, 200),
      })

      await page.focus('#password')
      await page.keyboard.type(process.env.SCRAPER_TERMENE_PASSWORD, {
        delay: this.getRandomDelay(100, 200),
      })

      await Promise.all([page.waitForNavigation(), page.click('#loginBtn')])
    }
  }

  private getRandomDelay = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min)
}
