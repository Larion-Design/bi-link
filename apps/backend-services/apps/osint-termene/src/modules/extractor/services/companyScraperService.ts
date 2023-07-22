import { Injectable, Logger } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'
import { OSINTCompany } from 'defs'
import { associatesSchema, TermeneAssociateSchema } from '../../../schema/associates'
import { balanceSheetSchema } from '../../../schema/balanceSheet'
import { branchesSchema } from '../../../schema/branches'
import { CAENCodesSchema } from '../../../schema/caen'
import { CompanyTermeneDataset, searchCompaniesByNameSchema } from '../../../schema/company'
import { contactDetailsSchema } from '../../../schema/contactDetails'
import { courtFilesSchema } from '../../../schema/courtFiles'
import { companyHeaderInfoSchema, companyProfileSchema } from '../../../schema/generalInfo'
import { getCompanyUrl } from '../helpers'
import { AssociateScraperService } from './associateScraperService'
import { TermeneAuthService } from './termeneAuthService'

@Injectable()
export class CompanyScraperService {
  private readonly logger = new Logger(CompanyScraperService.name)
  private readonly companiesUrl = 'https://termene.ro/firme'

  constructor(
    private readonly browserService: BrowserService,
    private readonly associateDatasetScraperService: AssociateScraperService,
    private readonly termeneAuthService: TermeneAuthService,
  ) {}

  async extractCompanyData(cui: string) {
    const dataset = await this.termeneAuthService.authenticatedPage(async (page) => {
      await page.goto(getCompanyUrl(cui))

      const dataset: CompanyTermeneDataset = {}

      await page.waitForResponse(async (response) => {
        const success = response.ok()

        if (success) {
          const url = response.url()

          if (url.includes('CAEN.php')) {
            dataset.caen = CAENCodesSchema.parse(await response.json())
          } else if (url.includes('workPoints.php')) {
            dataset.branches = branchesSchema.parse(await response.json())
          } else if (url.includes('contactInfo.php')) {
            dataset.contactDetails = contactDetailsSchema.parse(await response.json())
          } else if (url.includes('DataV2.php?type=header')) {
            dataset.headerInfo = companyHeaderInfoSchema.parse(await response.json())
          } else if (url.includes('DataV2.php?type=companyProfile')) {
            dataset.profileInfo = companyProfileSchema.parse(await response.json())
          } else if (url.includes('balanceSheet.php')) {
            dataset.balanceSheet = balanceSheetSchema.parse(await response.json())
          } else if (url.includes('courtFilesV2.php')) {
            dataset.courtCases = courtFilesSchema.parse(await response.json())
          } else if (url.includes('associatesAdministrators.php')) {
            dataset.associates = associatesSchema.parse(await response.json())
          }
        }
        return success
      })

      return dataset
    })

    if (dataset) {
      try {
        if (dataset.associates) {
          dataset.associates.asociatiAdministratori.administratori =
            await this.assignEntitiesTermeneUrl(
              cui,
              dataset.associates.asociatiAdministratori.administratori,
            )

          dataset.associates.asociatiAdministratori.asociati = await this.assignEntitiesTermeneUrl(
            cui,
            dataset.associates.asociatiAdministratori.asociati,
          )
        }
        return dataset
      } catch (e) {
        this.logger.error(e)
      }
    }
  }

  private async assignEntitiesTermeneUrl(companyCUI: string, associates: TermeneAssociateSchema[]) {
    const cachedUrls = new Map<string, string>()
    const updatedAssociates: TermeneAssociateSchema[] = []

    for await (const associate of associates) {
      if (!cachedUrls.has(associate.nume)) {
        if (associate.tipAA === 'firma' && associate.cui) {
          associate.entityUrl = getCompanyUrl(String(associate.cui))
        } else if (associate.tipAA === 'persoana') {
          associate.entityUrl =
            await this.associateDatasetScraperService.getPersonAssociateTermeneUrl(
              companyCUI,
              associate.nume,
            )
        }

        if (associate.entityUrl?.length) {
          cachedUrls.set(associate.nume, associate.entityUrl)
        }
        updatedAssociates.push(associate)
      }
    }
    return updatedAssociates
  }

  searchCompaniesByName = async (name: string) =>
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
            blockResources: ['image', 'media', 'ping', 'eventsource', 'preflight', 'prefetch'],
          },
        ),
      { private: true, sessionId: `osint.termene.search.companies` },
    )

  getBasicCompanyDataSet = async (cui: string) =>
    this.browserService.execBrowserSession(
      async (context) =>
        this.browserService.handlePage(
          context,
          async (page) => {
            await page.goto(getCompanyUrl(cui))

            const { name, registrationNumber, headquarters } = await page.$$eval(
              ['#fiscalName', '#fiscalRegCode', '#fiscalAddress'].join(','),
              ([nameElem, regNumberElem, hqElem]) => ({
                name: nameElem?.textContent?.trim() ?? '',
                registrationNumber: regNumberElem?.textContent?.trim() ?? '',
                headquarters: hqElem?.textContent?.trim() ?? '',
              }),
            )

            return {
              cui,
              name,
              registrationNumber,
              headquarters,
            } as OSINTCompany
          },
          {
            disableJavascript: true,
            htmlOnly: true,
          },
        ),
      { private: true, sessionId: `osint.termene.import.basic.${cui}` },
    )
}
