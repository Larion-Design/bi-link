import { Controller } from '@nestjs/common'
import { CompanyBasicDataSetScraperService } from '../services/companyBasicDataSetScraperService'

@Controller()
export class CompanyByCUIController {
  constructor(
    private readonly companyBasicDataSetScraperService: CompanyBasicDataSetScraperService,
  ) {}

  async getCompanyBasicInfoByCui(cui: string) {
    const result = await this.companyBasicDataSetScraperService.getBasicCompanyDataSet(cui)

    if (result) {
      return Object.fromEntries(result)
    }
  }
}
