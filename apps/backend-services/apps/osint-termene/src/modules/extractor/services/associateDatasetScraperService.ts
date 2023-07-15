import { Injectable } from '@nestjs/common'
import { ElementHandle, Page } from 'puppeteer-core'
import { BrowserService } from '@app/browser-module/browserService'
import { OSINTCompanySchema, OSINTPerson, OSINTPersonSchema } from 'defs'
import { delay } from '../../../helpers'
import { getPersonAssociateUrl } from '../helpers'

type CompanyInfo = {
  name?: string
  cui?: string
  role?: string
}

@Injectable()
export class AssociateDatasetScraperService {
  constructor(private readonly browserService: BrowserService) {}

  searchAssociatesByName = async (name: string, address?: string) =>
    this.browserService.handlePage(async (page) => {
      await this.openSearchPage(page, name, address)
      await page.waitForSelector('tbody')
      const tableRows = await page.$$('tbody > tr')
      return this.traverseSearchResults(tableRows)
    })

  getCompaniesByAssociateUrl = async (associateUrl: string) =>
    this.browserService.handlePage(async (page) => {
      await this.openAssociatePage(page, associateUrl)
      return this.extractCompaniesFromAssociatePage(page)
    })

  async getAssociatesCompaniesMapByPersonName(name: string, address?: string) {
    const persons = await this.searchAssociatesByName(name, address)
    const associatesMap = new Map<OSINTPerson, CompanyInfo[]>()

    if (!persons.length) {
      return associatesMap
    }

    await delay(1000)

    for await (const associateInfo of persons) {
      const companies = await this.getCompaniesByAssociateUrl(associateInfo.url)

      if (companies.length) {
        associatesMap.set(associateInfo, companies)
      }
      await delay(2000)
    }
    return associatesMap
  }

  getPersonAssociateTermeneUrl = async (companyCUI: string, name: string, address?: string) =>
    this.browserService.handlePage(async (page) => {
      await this.openSearchPage(page, name, address)
      await page.waitForSelector('tbody')
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
        return person.url
      }
    })

  private async isPersonAssociateOfCompany(page: Page, associateUrl: string, cui: string) {
    await this.openAssociatePage(page, associateUrl)
    await page.waitForSelector('tbody')
    return Boolean(await page.$(`tbody a[href*="${cui}"]`))
  }

  private async openSearchPage(page: Page, name: string, address?: string) {
    await page.goto(this.getSearchUrl(name, address))
    await page.waitForNetworkIdle()
  }

  private getSearchUrl(name: string, address?: string) {
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

  private traverseSearchResults = async (tableRows: ElementHandle<HTMLTableRowElement>[]) =>
    Promise.all<OSINTPerson>(
      tableRows.map(async (tableRow) => {
        const [, nameColumn, addressColumn] = await tableRow.$$('.detalii-text-tabel')
        const personName = await nameColumn?.evaluate((elem) => elem?.textContent?.trim())
        const personAddress = await addressColumn?.evaluate((elem) => elem?.textContent?.trim())

        const personIdElement = await tableRow.$("form input[name='company_id']")
        const personId = await personIdElement?.evaluate((element) => element.value.trim())
        const associateUrl = personId ? getPersonAssociateUrl(personId) : ''

        return OSINTPersonSchema.parse({
          id: personId,
          name: personName,
          address: personAddress,
          url: associateUrl,
        })
      }),
    )

  private async openAssociatePage(page: Page, associateUrl: string) {
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
          companyInfo.name = await companyInfoElem.evaluate(
            (elem) => elem.textContent?.trim() ?? '',
          )
        }
        if (roleElem) {
          companyInfo.role = await roleElem.evaluate((elem) => elem.textContent?.trim() ?? '')
        }
        return OSINTCompanySchema.parse(companyInfo)
      }),
    )
  }
}
