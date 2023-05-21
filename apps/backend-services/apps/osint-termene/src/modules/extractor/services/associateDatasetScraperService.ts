import { Logger } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'
import { ElementHandle, Page } from 'puppeteer-core'
import { delay } from '../../../helpers'

type CompanyInfo = {
  name?: string
  cui?: string
  role?: string
}

type AssociateInfo = {
  id: string
  name: string
  address: string
  url: string
}

export class AssociateDatasetScraperService {
  private readonly logger = new Logger(AssociateDatasetScraperService.name)

  constructor(private readonly browserService: BrowserService) {}

  searchAssociatesByName = async (name: string, address?: string) => {
    const page = await this.openSearchPage(name, address)
    const associatesMap = new Map<AssociateInfo, CompanyInfo[]>()

    const tableRows = await page.$$('tbody > tr')
    const persons = await this.traverseSearchResults(tableRows)

    for await (const associateInfo of persons) {
      await delay(3000)
      await this.openAssociatePage(page, associateInfo.url)
      const companies = await this.extractCompaniesFromAssociatePage(page)

      if (companies.length) {
        associatesMap.set(associateInfo, companies)
      }
    }

    await page.close()
    return associatesMap
  }

  getPersonAssociateTermeneUrl = async (companyCUI: string, name: string, address?: string) => {
    const page = await this.openSearchPage(name, address)

    try {
      const tableRows = await page.$$('tbody > tr')
      const persons = await this.traverseSearchResults(tableRows)

      const person = persons.find(
        ({ name: personName, address: personAddress }) =>
          personName === name && (!address || personAddress === address),
      )

      if (
        person?.url?.length &&
        (await this.isPersonAssociateOfCompany(page, person.url, companyCUI))
      ) {
        await page.close()
        return person.url
      }
    } catch (e) {
      this.logger.error(e)
    }
    await page.close()
  }

  private openSearchPage = async (name: string, address?: string) => {
    const browser = await this.browserService.getBrowser()
    const page = await browser.newPage()
    await page.goto(this.getSearchUrl(name, address))
    await page.waitForNetworkIdle()
    return page
  }

  private isPersonAssociateOfCompany = async (page: Page, associateUrl: string, cui: string) => {
    await this.openAssociatePage(page, associateUrl)
    return Boolean(await page.$(`tbody a[href*="${cui}"]`))
  }

  private traverseSearchResults = (tableRows: ElementHandle<HTMLTableRowElement>[]) =>
    Promise.all(
      tableRows.map(async (tableRow) => {
        const [_, nameColumn, addressColumn] = await tableRow.$$('.detalii-text-tabel')
        const personName = await nameColumn?.evaluate((elem) => elem?.textContent?.trim())
        const personAddress = await addressColumn?.evaluate((elem) => elem?.textContent?.trim())

        const personIdElement = await tableRow.$("form input[name='company_id']")
        const personId = await personIdElement?.evaluate((element) => element.value.trim())
        const associateUrl = personId ? this.getPersonAssociateUrl(personId) : ''

        return {
          id: personId,
          name: personName,
          address: personAddress,
          url: associateUrl,
        } as AssociateInfo
      }),
    )

  private openAssociatePage = async (page: Page, associateUrl: string) => {
    await page.goto(associateUrl)
    await page.waitForNetworkIdle()
  }

  private extractCompaniesFromAssociatePage = async (page: Page) => {
    const rows = await page.$$(`.df-ta-main-row`)
    return Promise.all(
      rows.map(async (row) => {
        const companyInfo: CompanyInfo = {}
        const companyInfoElem = await row.$('a[href^="/catalog"]')
        const roleElem = await row.$('td:nth-child(2)')

        if (companyInfoElem) {
          companyInfo.cui = await companyInfoElem.evaluate((elem) =>
            elem.href.replace('/catalog/firme/cauta/', ''),
          )
          companyInfo.name =
            (await companyInfoElem.evaluate((elem) => elem.textContent?.trim())) ?? ''
        }
        if (roleElem) {
          companyInfo.role = (await roleElem.evaluate((elem) => elem.textContent?.trim())) ?? ''
        }
        return companyInfo
      }),
    )
  }

  private getSearchUrl = (name: string, address?: string) => {
    const url = new URL('https://termene.ro/search.php')
    const params: Record<string, string> = {
      submitted: 'true',
      'search[nume]': name,
    }

    if (address) {
      params['search[adresa]'] = address
    }

    url.search = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    return url.toString()
  }

  private getPersonAssociateUrl = (personId: string) =>
    `https://termene.ro/persoana.php?id=${personId}`
}
