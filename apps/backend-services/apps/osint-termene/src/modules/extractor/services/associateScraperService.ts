import { Injectable } from '@nestjs/common'
import { BrowserContext, ElementHandle, Page } from 'puppeteer-core'
import { BrowserService } from '@app/browser-module/browserService'
import { OSINTCompanySchema, OSINTPerson, OSINTPersonSchema } from 'defs'
import { delay } from '../../../helpers'
import { getPersonAssociateUrl } from '../helpers'
import { TermeneAuthService } from './termeneAuthService'

type CompanyInfo = {
  name?: string
  cui?: string
  role?: string
}

@Injectable()
export class AssociateScraperService {
  constructor(
    private readonly browserService: BrowserService,
    private readonly termeneAuthService: TermeneAuthService,
  ) {}

  searchAssociatesByName = async (context: BrowserContext, name: string, address?: string) =>
    this.browserService.handlePage(context, async (page) => {
      await this.openSearchPage(page, name, address)
      await page.waitForSelector('tbody')
      const tableRows = await page.$$('tbody > tr')
      return this.traverseSearchResults(tableRows)
    })

  getCompaniesByAssociateUrl = async (associateUrl: string) =>
    this.termeneAuthService.authenticatedPage(async (page) => {
      await page.goto(associateUrl)
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
      const companies = await this.getCompaniesByAssociateUrl(associateInfo.url)

      if (companies?.length) {
        associatesMap.set(associateInfo, companies)
      }
      await delay(2000)
    }
    return associatesMap
  }

  getPersonAssociateTermeneUrl = async (companyCUI: string, name: string, address?: string) =>
    this.termeneAuthService.authenticatedPage(async (page) => {
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
      return ''
    })

  private async isPersonAssociateOfCompany(page: Page, associateUrl: string, cui: string) {
    await page.goto(associateUrl)
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
        const { name, address } = await tableRow.$$eval(
          '.detalii-text-tabel',
          ([, nameColumn, addressColumn]) => ({
            name: nameColumn?.textContent?.trim() ?? '',
            address: addressColumn?.textContent?.trim() ?? '',
          }),
        )

        const personId = await tableRow.$eval("form input[name='company_id']", (element) =>
          element.value.trim(),
        )

        const personInfo: OSINTPerson = {
          id: personId,
          name,
          address,
          url: personId.length ? getPersonAssociateUrl(personId) : '',
        }

        return OSINTPersonSchema.parse(personInfo)
      }),
    )

  private async extractCompaniesFromAssociatePage(page: Page) {
    const companies = await page.$$eval('.df-ta-main-row a[href^="/catalog"]', (anchorLinks) =>
      anchorLinks.map((achorLink) => ({
        cui: achorLink.href.replace('/catalog/firme/cauta/', ''),
        name: achorLink.textContent?.trim() ?? '',
      })),
    )

    return OSINTCompanySchema.array().parse(companies)
  }
}
