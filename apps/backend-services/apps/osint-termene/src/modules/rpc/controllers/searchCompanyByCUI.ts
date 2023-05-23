import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CompanyBasicDatasetScraperService } from '../../extractor'

type Params = Parameters<OsintTermeneServiceConfig['searchCompanyByCUI']>[0]
type Result = ReturnType<OsintTermeneServiceConfig['searchCompanyByCUI']> | undefined

@Controller()
export class SearchCompanyByCUI {
  constructor(
    private readonly companyBasicDatasetScraperService: CompanyBasicDatasetScraperService,
  ) {}

  @MessagePattern(MICROSERVICES.OSINT.TERMENE.searchCompanyByCUI)
  async searchCompanyByCUI(@Payload() cui: Params): Promise<Result> {
    return this.companyBasicDatasetScraperService.getBasicCompanyDataSet(cui)
  }
}
