import { Logger } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'

export class AssociateDatasetScraperService {
  private readonly logger = new Logger(AssociateDatasetScraperService.name)

  constructor(private readonly browserService: BrowserService) {}

  getPersonAssociateTermeneUrl = async (companyCUI: string, name: string, address?: string) => {
    let personUrl: string | undefined
    const browser = await this.browserService.getBrowser()
    const page = await browser.newPage()

    try {
      const url = new URL('https://termene.ro/search.php')
      url.searchParams.set('submitted', 'true')
      url.searchParams.set('search[nume]', encodeURIComponent(name))

      if (address) {
        url.searchParams.set('search[adresa]', encodeURIComponent(address))
      }
      await page.goto(url.toString())
      await page.waitForNetworkIdle()

      let associateUrl: string | undefined
      const tableRows = await page.$$('tbody > tr')

      await Promise.all(
        tableRows.map(async (tableRow) => {
          if (!associateUrl) {
            const [_, nameColumn, addressColumn] = await tableRow.$$('.detalii-text-tabel')

            const personName = await nameColumn?.evaluate((elem) => elem?.textContent?.trim())
            const personAddress = await addressColumn?.evaluate((elem) => elem?.textContent?.trim())

            if (personName === name && (!address || personAddress === address)) {
              const personIdElement = await tableRow.$("form input[name='company_id']")
              const personId = await personIdElement?.evaluate((element) => element.value.trim())

              if (personId?.length) {
                associateUrl = this.getPersonAssociateUrl(personId)
              }
            }
          }
        }),
      )

      if (associateUrl) {
        await page.goto(associateUrl)
        const companyIdCell = !!(await page.$(`tbody a[href='${this.getCompanyUri(companyCUI)}']`))

        if (companyIdCell) {
          personUrl = associateUrl
        }
      }
    } catch (e) {
      this.logger.error(e)
      await page.close()
    }
    return personUrl
  }

  private getPersonAssociateUrl = (personId: string) =>
    `https://termene.ro/persoana.php?id=${personId}`
  private getCompanyUri = (companyCUI: string) => `/catalog/firme/cauta/${companyCUI}`
}
