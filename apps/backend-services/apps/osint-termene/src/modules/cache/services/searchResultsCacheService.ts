import { CacheService } from '@app/cache'
import { Injectable } from '@nestjs/common'
import { OSINTCompany, OSINTCompanySchema } from 'defs'

@Injectable()
export class SearchResultsCacheService {
  constructor(private readonly cacheService: CacheService) {}

  async getCachedResults(searchTerm: string) {
    const results = await this.cacheService.get(this.formatCacheKey(searchTerm))

    if (results) {
      return OSINTCompanySchema.array().parseAsync(JSON.parse(results))
    }
  }

  async cacheResults(searchTerm: string, results: OSINTCompany[]) {
    return this.cacheService.set(this.formatCacheKey(searchTerm), JSON.stringify(results), 3600)
  }

  private formatCacheKey = (searchTerm: string) => `osint.termene.cache.search[${searchTerm}]`
}
