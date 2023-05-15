import { Injectable } from '@nestjs/common'
import { BrowserService } from '@app/browser-module/browserService'
import { associatesSchema } from '../schema/associates'
import { balanceSheetSchema } from '../schema/balanceSheet'
import { branchesSchema } from '../schema/branches'
import { CAENCodesSchema } from '../schema/caen'
import { CompanyTermeneDataset } from '../schema/company'
import { contactDetailsSchema } from '../schema/contactDetails'
import { courtFilesSchema } from '../schema/courtFiles'
import { companyHeaderInfoSchema, companyProfileSchema } from '../schema/generalInfo'
import { TermeneScraperService } from './termeneScraperService'

@Injectable()
export class CompanyDatasetScraperService {
  constructor(
    private readonly browserService: BrowserService,
    private readonly termeneScraperService: TermeneScraperService,
  ) {}

  getFullCompanyDataSet = async (cui: string) => {
    const browser = await this.browserService.getBrowser()
    const page = await browser.newPage()

    await this.termeneScraperService.authenticate(page)
    await page.goto(this.getCompanyUri(cui))
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
    return dataset
  }

  private getCompanyUri = (cui: string) => `https://termene.ro/firma/${cui}-firma`
  private getCourtCaseUri = (uid: string) => `https://termene.ro/detalii_dosar_modular/${uid}`
}
