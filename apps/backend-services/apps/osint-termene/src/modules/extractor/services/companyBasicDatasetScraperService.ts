import { Injectable } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'
import { OSINTCompany } from 'defs'
import { getCompanyUrl } from '../helpers'

@Injectable()
export class CompanyBasicDatasetScraperService {
  constructor(private readonly browserService: BrowserService) {}

  getBasicCompanyDataSet = async (cui: string) =>
    this.browserService.handlePrivatePage(async (page) => {
      await page.goto(getCompanyUrl(cui))
      await page.waitForSelector('#date-de-identificare')
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
            const label = await page.evaluate(
              (element) => element?.textContent?.trim() ?? '',
              labelElement,
            )
            const value = await page.evaluate(
              (element) => element?.textContent?.trim() ?? '',
              valuelement,
            )

            const labelToKeysMap: { [key: string]: keyof OSINTCompany } = {
              'Nume firma': 'name',
              'Cod Unic de Înregistrare': 'cui',
              'Nr. Înmatriculare': 'registrationNumber',
            }

            if (value?.length && labelToKeysMap[label]) {
              company[labelToKeysMap[label] as keyof OSINTCompany] = value
            }
          }),
        )
      }
      return company
    })
}
