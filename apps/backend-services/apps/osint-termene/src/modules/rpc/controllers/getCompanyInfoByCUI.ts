import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'
import { CompanyDatasetScraperService } from '../../extractor/services/companyDatasetScraperService'
import { TermeneAuthService } from '../../extractor/services/termeneAuthService'
import { CompanyDataTransformerService } from '../../transformer/services/companyDataTransformerService'
import { ProceedingDataTransformer } from '../../transformer/services/proceedingDataTransformer'

type Params = Parameters<OsintTermeneServiceConfig['getCompanyInfoByCUI']>[0]
type Result = ReturnType<OsintTermeneServiceConfig['getCompanyInfoByCUI']> | undefined

@Controller()
export class GetCompanyInfoByCUI {
  constructor(
    private readonly termeneAuthService: TermeneAuthService,
    private readonly companyDatasetScraperService: CompanyDatasetScraperService,
    private readonly companyDataTransformerService: CompanyDataTransformerService,
    private readonly proceedingDataTransformerService: ProceedingDataTransformer,
  ) {}

  @MessagePattern(MICROSERVICES.OSINT.TERMENE.getCompanyInfoByCUI)
  async getCompanyInfoByCUI(@Payload() cui: Params): Promise<Result> {
    await this.termeneAuthService.authenticate()
    const companyScrapedInfo = await this.companyDatasetScraperService.getFullCompanyDataSet(cui)

    if (companyScrapedInfo) {
      const companyId = await this.companyDataTransformerService.transformCompanyData(
        cui,
        companyScrapedInfo,
      )

      if (companyScrapedInfo.courtCases?.rezultatele_cautarii.length) {
        await this.proceedingDataTransformerService.transformProceedings(
          companyScrapedInfo.courtCases.rezultatele_cautarii,
          this.companyDataTransformerService.getCompanyUrl(cui),
        )
      }
      return companyId
    }
  }
}
