import { Controller } from '@nestjs/common'
import { CompanyBasicDatasetScraperService } from '../services/companyBasicDatasetScraperService'

@Controller()
export class CompanyByCUIController {
  constructor(
    private readonly companyBasicDataSetScraperService: CompanyBasicDatasetScraperService,
  ) {}

  async getCompanyBasicInfoByCui(cui: string) {
    const result = await this.companyBasicDataSetScraperService.getBasicCompanyDataSet(cui)

    if (result) {
      return Object.fromEntries(result)
    }
  }
}
