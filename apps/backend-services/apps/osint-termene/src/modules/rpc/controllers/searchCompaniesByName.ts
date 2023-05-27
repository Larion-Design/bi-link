import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CompanyBasicDatasetScraperService } from '../../extractor'

type Params = Parameters<OsintTermeneServiceConfig['searchCompaniesByName']>[0]
type Result = ReturnType<OsintTermeneServiceConfig['searchCompaniesByName']> | undefined

@Controller()
export class SearchCompaniesByName {
  constructor(
    private readonly companyBasicDatasetScraperService: CompanyBasicDatasetScraperService,
  ) {}

  @MessagePattern(MICROSERVICES.OSINT.TERMENE.searchCompaniesByName)
  async searchCompaniesByName(@Payload() name: Params): Promise<Result> {
    return this.companyBasicDatasetScraperService.searchCompaniesByName(name)
  }
}
