import { Injectable } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'
import { OSINTCompany } from 'defs'
import { getCompanyUrl } from '../helpers'
import { searchCompaniesByNameSchema } from '../../../schema/company'

@Injectable()
export class CompanyBasicDatasetScraperService {
  private readonly companiesUrl = 'https://termene.ro/firme'

  constructor(private readonly browserService: BrowserService) {}

  searchCompaniesByName = async (name: string): Promise<OSINTCompany[] | undefined> =>
    this.browserService.execBrowserSession(async (browser) =>
      this.browserService.handlePrivatePage(browser, async (page) => {
        await page.goto(this.companiesUrl)
        await page.waitForSelector('#autocompleterCompanySearchVerify')
        const elem = await page.$('#autocompleterCompanySearchVerify')
        const companies: OSINTCompany[] = []

        if (elem) {
          await elem.type(name, { delay: 80 })

          await page.waitForResponse(async (response) => {
            const success = response.ok()

            if (success && response.url().includes('searchCompany.php')) {
              const data = searchCompaniesByNameSchema.parse(await response.json())
              data.forEach(({ nume, cui }) => companies.push({ cui: String(cui), name: nume }))
            }
            return success
          })
        }
        return companies
      }),
    )

  getBasicCompanyDataSet = async (cui: string) =>
    this.browserService.execBrowserSession(async (browser) =>
      this.browserService.handlePrivatePage(browser, async (page) => {
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
        return [company]
      }),
    )
}
