import { Injectable } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'

@Injectable()
export class CompanyBasicDatasetScraperService {
  constructor(private readonly browserService: BrowserService) {}

  getBasicCompanyDataSet = async (cui: string) => {
    const browser = await this.browserService.getBrowser()
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()

    await page.goto(this.getCompanyUri(cui))
    const tableRows = await page.$$('#date-de-identificare tbody tr')
    const resultMap = new Map<string, string>()

    if (tableRows?.length) {
      await Promise.all(
        tableRows.map(async (tableRow) => {
          const [labelElement, valuelement] = await tableRow.$$('td')
          const label = await page.evaluate((element) => element?.textContent?.trim(), labelElement)
          const value = await page.evaluate((element) => element?.textContent?.trim(), valuelement)

          if (label && value) {
            resultMap.set(label, value)
          }
        }),
      )
    }

    await page.close()
    return resultMap
  }

  private getCompanyUri = (cui: string) => `https://termene.ro/firma/${cui}-firma`
}
