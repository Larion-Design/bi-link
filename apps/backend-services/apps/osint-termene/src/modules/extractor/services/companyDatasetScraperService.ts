import { Injectable, Logger } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'
import { associatesSchema, TermeneAssociateSchema } from '../../../schema/associates'
import { balanceSheetSchema } from '../../../schema/balanceSheet'
import { branchesSchema } from '../../../schema/branches'
import { CAENCodesSchema } from '../../../schema/caen'
import { CompanyTermeneDataset } from '../../../schema/company'
import { contactDetailsSchema } from '../../../schema/contactDetails'
import { courtFilesSchema } from '../../../schema/courtFiles'
import { companyHeaderInfoSchema, companyProfileSchema } from '../../../schema/generalInfo'
import { getCompanyUrl } from '../helpers'
import { AssociateDatasetScraperService } from './associateDatasetScraperService'
import { TermeneAuthService } from './termeneAuthService'

@Injectable()
export class CompanyDatasetScraperService {
  private readonly logger = new Logger(CompanyDatasetScraperService.name)

  constructor(
    private readonly browserService: BrowserService,
    private readonly associateDatasetScraperService: AssociateDatasetScraperService,
    private readonly termeneAuthService: TermeneAuthService,
  ) {}

  getFullCompanyDataSet = async (cui: string) => {
    await this.termeneAuthService.authenticate()

    const dataset = await this.browserService.handlePage(async (page) => {
      await page.goto(getCompanyUrl(cui))
      await page.waitForNetworkIdle()

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

  private assignEntitiesTermeneUrl = async (
    companyCUI: string,
    associates: TermeneAssociateSchema[],
  ) => {
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
}
