import { Injectable } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'
import { OSINTCompany } from 'defs'

@Injectable()
export class CompanyBasicDatasetScraperService {
  constructor(private readonly browserService: BrowserService) {}

  getBasicCompanyDataSet = async (cui: string) => {
    const browser = await this.browserService.getBrowser()
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()

    await page.goto(this.getCompanyUri(cui))
    const tableRows = await page.$$('#date-de-identificare tbody tr')
    const company: OSINTCompany = {
      cui,
      name: '',
      registrationNumber: '',
      headquarters: '',
    }

    if (tableRows?.length) {
      await Promise.all(
        tableRows.map(async (tableRow) => {
          const [labelElement, valuelement] = await tableRow.$$('td')
          const label = await page.evaluate((element) => element?.textContent?.trim(), labelElement)
          const value = await page.evaluate((element) => element?.textContent?.trim(), valuelement)

          if (value?.length) {
            switch (label) {
              case 'Nume firma': {
                company.name = value
                break
              }
              case 'Cod Unic de Înregistrare': {
                company.cui = cui
                break
              }
              case 'Nr. Înmatriculare': {
                company.registrationNumber = value
                break
              }
              case '.': {
                company.headquarters = value
                break
              }
            }
          }
        }),
      )
    }

    await page.close()
    return company
  }

  private getCompanyUri = (cui: string) => `https://termene.ro/firma/${cui}-firma`
}
