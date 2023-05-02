import { Injectable } from '@nestjs/common'
import { Page } from 'puppeteer-core'
import { BrowserService } from '@app/browser-module/browserService'

@Injectable()
export class CompanyDataSetScraperService {
  constructor(private readonly browserService: BrowserService) {}

  getFullCompanyDataSet = async (cui: string) => {
    const browser = await this.browserService.getBrowser()
    const page = await browser.newPage()

    await this.authenticate(page)
    await page.goto(`https://termene.ro/firma/${cui}-firma`)

    const resultMap = new Map<string, string>()

    await page.close()
    return resultMap
  }

  private getBranches = async (page: Page) => Promise.resolve()
  private getGeneralInfo = async (page: Page) => Promise.resolve()
  private getAssociates = async (page: Page) => Promise.resolve()
  private getTaxInformation = async (page: Page) => Promise.resolve()
  private getLegalProceedings = async (page: Page) => Promise.resolve()

  private authenticate = async (page: Page) => {
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
