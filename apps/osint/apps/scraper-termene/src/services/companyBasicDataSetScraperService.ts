import { Injectable } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'

@Injectable()
export class CompanyBasicDataSetScraperService {
  constructor(private readonly browserService: BrowserService) {}

  getBasicCompanyDataSet = async (cui: string) => {
    const browser = await this.browserService.getBrowser()
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()

    await page.goto(`https://termene.ro/firma/${cui}-firma`)

    const tableRows = await page.$$('#date-de-identificare tbody tr')
    const resultMap = new Map<string, string>()

    await Promise.all(
      tableRows.map(async (tableRow, index) => {
        const [labelElement, valuelement] = await tableRows[index].$$('td')
        const label = await page.evaluate((element) => element.textContent.trim(), labelElement)
        const value = await page.evaluate((element) => element.textContent.trim(), valuelement)
        resultMap.set(label, value)
      }),
    )

    await page.close()
    return resultMap
  }
}
