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
import { AssociateDatasetScraperService } from './associateDatasetScraperService'

@Injectable()
export class CompanyDatasetScraperService {
  private readonly logger = new Logger(CompanyDatasetScraperService.name)

  constructor(
    private readonly browserService: BrowserService,
    private readonly associateDatasetScraperService: AssociateDatasetScraperService,
  ) {}

  getFullCompanyDataSet = async (cui: string) => {
    const browser = await this.browserService.getBrowser()
    const page = await browser.newPage()

    try {
      await page.goto(this.getCompanyUrl(cui))
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

      await page.close()

      if (dataset.associates) {
        const assignEntityTermeneUrl = async (associate: TermeneAssociateSchema) => {
          if (associate.tipAA === 'firma' && associate.cui) {
            associate.entityUrl = this.getCompanyUrl(String(associate.cui))
          } else if (associate.tipAA === 'persoana') {
            associate.entityUrl =
              await this.associateDatasetScraperService.getPersonAssociateTermeneUrl(
                cui,
                associate.nume,
              )
          }
          return associate
        }

        dataset.associates.asociatiAdministratori.administratori = await Promise.all(
          dataset.associates.asociatiAdministratori.administratori.map(assignEntityTermeneUrl),
        )

        dataset.associates.asociatiAdministratori.asociati = await Promise.all(
          dataset.associates.asociatiAdministratori.asociati.map(assignEntityTermeneUrl),
        )
      }
      return dataset
    } catch (e) {
      this.logger.error(e)

      if (!page.isClosed()) {
        await page.close()
      }
    }
  }

  private getCompanyUrl = (cui: string) => `https://termene.ro/firma/${cui}-firma`
  private getCourtCaseUri = (uid: string) => `https://termene.ro/detalii_dosar_modular/${uid}`
}
