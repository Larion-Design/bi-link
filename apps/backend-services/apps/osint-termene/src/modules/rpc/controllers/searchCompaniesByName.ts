import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { SearchResultsCacheService } from '../../cache'
import { CompanyScraperService } from '../../extractor'

type Params = Parameters<OsintTermeneServiceConfig['searchCompaniesByName']>[0]
type Result = ReturnType<OsintTermeneServiceConfig['searchCompaniesByName']> | undefined

@Controller()
export class SearchCompaniesByName {
  constructor(
    private readonly companyScraperService: CompanyScraperService,
    private readonly searchResultsCacheService: SearchResultsCacheService,
  ) {}

  @MessagePattern(MICROSERVICES.OSINT.TERMENE.searchCompaniesByName)
  async searchCompaniesByName(@Payload() searchTerm: Params): Promise<Result> {
    const cachedResults = await this.searchResultsCacheService.getCachedResults(searchTerm)

    if (cachedResults) {
      return cachedResults
    }

    const companies = await this.companyScraperService.searchCompaniesByName(searchTerm)

    if (companies?.length) {
      await this.searchResultsCacheService.cacheResults(searchTerm, companies)
    }
    return companies
  }
}
