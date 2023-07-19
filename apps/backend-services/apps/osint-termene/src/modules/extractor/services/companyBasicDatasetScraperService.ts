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
    this.browserService.execBrowserSession(
      async (context) =>
        this.browserService.handlePage(
          context,
          async (page) => {
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
          },
          {
            blockResources: [
              'script',
              'media',
              'font',
              'cspviolationreport',
              'other',
              'cspviolationreport',
              'eventsource',
              'fetch',
              'stylesheet',
              'texttrack',
            ],
            disableJavascript: true,
          },
        ),
      true,
    )

  getBasicCompanyDataSet = async (cui: string) =>
    this.browserService.execBrowserSession(
      async (context) =>
        this.browserService.handlePage(context, async (page) => {
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
            const labelToKeysMap: { [key: string]: keyof OSINTCompany } = {
              'Nume firma': 'name',
              'Cod Unic de Înregistrare': 'cui',
              'Nr. Înmatriculare': 'registrationNumber',
            }

            await Promise.all(
              tableRows.map(async (tableRow) => {
                const [labelElement, valuelement] = await tableRow.$$('td')

                const [label, value] = await Promise.all([
                  page.evaluate((element) => element?.textContent?.trim() ?? '', labelElement),
                  page.evaluate((element) => element?.textContent?.trim() ?? '', valuelement),
                ])

                if (value?.length && labelToKeysMap[label]) {
                  company[labelToKeysMap[label] as keyof OSINTCompany] = value
                }
              }),
            )
          }

          const headquarters = await page.$eval(
            '#fiscalAddress',
            (element) => element?.textContent?.trim() ?? '',
          )

          if (headquarters?.length) {
            company.headquarters = headquarters
          }
          return company
        }),
      true,
    )
}
