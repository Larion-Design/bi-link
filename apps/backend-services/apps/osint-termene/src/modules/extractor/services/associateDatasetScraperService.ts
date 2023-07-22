import { Injectable } from '@nestjs/common'
import { BrowserContext, ElementHandle, Page } from 'puppeteer-core'
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

  searchAssociatesByName = async (context: BrowserContext, name: string, address?: string) =>
    this.browserService.handlePage(context, async (page) => {
      await this.openSearchPage(page, name, address)
      await page.waitForSelector('tbody')
      const tableRows = await page.$$('tbody > tr')
      return this.traverseSearchResults(tableRows)
    })

  getCompaniesByAssociateUrl = async (context: BrowserContext, associateUrl: string) =>
    this.browserService.handlePage(context, async (page) => {
      await this.openAssociatePage(page, associateUrl)
      return this.extractCompaniesFromAssociatePage(page)
    })

  async getAssociatesCompaniesMapByPersonName(
    context: BrowserContext,
    name: string,
    address?: string,
  ) {
    const persons = await this.searchAssociatesByName(context, name, address)
    const associatesMap = new Map<OSINTPerson, CompanyInfo[]>()

    if (!persons.length) {
      return associatesMap
    }

    await delay(1000)

    for await (const associateInfo of persons) {
      const companies = await this.getCompaniesByAssociateUrl(context, associateInfo.url)

      if (companies.length) {
        associatesMap.set(associateInfo, companies)
      }
      await delay(2000)
    }
    return associatesMap
  }

  getPersonAssociateTermeneUrl = async (
    context: BrowserContext,
    companyCUI: string,
    name: string,
    address?: string,
  ) =>
    this.browserService.handlePage(context, async (page) => {
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
    const params: [string, string][] = [
      ['submitted', 'true'],
      ['search[nume]', name],
    ]

    if (address) {
      params.push(['search[adresa]', address])
    }

    url.search = params.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
    return url.toString()
  }

  private traverseSearchResults = async (tableRows: ElementHandle<HTMLTableRowElement>[]) =>
    Promise.all(
      tableRows.map(async (tableRow) => {
        const [, nameColumn, addressColumn] = await tableRow.$$('.detalii-text-tabel')
        const personName = await nameColumn?.evaluate((elem) => elem?.textContent?.trim() ?? '')
        const personAddress = await addressColumn?.evaluate(
          (elem) => elem?.textContent?.trim() ?? '',
        )
        const personId = await tableRow.$eval("form input[name='company_id']", (element) =>
          element.value.trim(),
        )

        const personInfo: OSINTPerson = {
          id: personId,
          name: personName ?? '',
          address: personAddress,
          url: personId.length ? getPersonAssociateUrl(personId) : '',
        }

        return OSINTPersonSchema.parse(personInfo)
      }),
    )

  private async openAssociatePage(page: Page, associateUrl: string) {
    await page.goto(associateUrl)
    await page.waitForNetworkIdle()
  }

  private async extractCompaniesFromAssociatePage(page: Page) {
    const rows = await page.$$(`.df-ta-main-row`)
    return Promise.all(
      rows.map(async (row) => {
        const companyNameAndCUI = await row.$eval('a[href^="/catalog"]', (elem) => ({
          cui: elem.href.replace('/catalog/firme/cauta/', ''),
          name: elem.textContent?.trim() ?? '',
        }))

        const companyInfo: CompanyInfo = {}

        if (companyNameAndCUI) {
          companyInfo.cui = companyNameAndCUI.cui
          companyInfo.name = companyNameAndCUI.name
        }
        return OSINTCompanySchema.parse(companyInfo)
      }),
    )
  }
}
