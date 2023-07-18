import { CacheService } from '@app/cache'
import { Injectable } from '@nestjs/common'

type KeyFormatter = (id: string) => string

@Injectable()
export class ImportedCompaniesCacheService {
  private readonly timeout = 3600

  constructor(private readonly cacheService: CacheService) {}

  async getNewCompanies(companiesCUI: string[]) {
    return this.getNewEntities(companiesCUI, this.formatCompanyCacheKey)
  }

  async getNewProceedings(fileNumbers: string[]) {
    return this.getNewEntities(fileNumbers, this.formatProceedingCacheKey)
  }

  async cacheCompanies(companiesCUI: string[]) {
    return this.cacheEntities(companiesCUI, this.formatCompanyCacheKey)
  }

  async cacheProceedings(fileNumbers: string[]) {
    return this.cacheEntities(fileNumbers, this.formatProceedingCacheKey)
  }

  async cacheCompany(cui: string) {
    return this.cacheEntity(cui, this.formatCompanyCacheKey)
  }

  async cacheProceeding(fileNumber: string) {
    return this.cacheEntity(fileNumber, this.formatProceedingCacheKey)
  }

  private async getNewEntities(entitiesIds: string[], cacheKeyFormatter: KeyFormatter) {
    const cachedEntitiesList = await this.cacheService.getMultiple(
      entitiesIds.map(cacheKeyFormatter),
    )
    return entitiesIds.filter((id) => !(cacheKeyFormatter(id) in cachedEntitiesList))
  }

  private async cacheEntities(entitiesIds: string[], cacheKeyFormatter: KeyFormatter) {
    const cacheKeys: Record<string, string> = {}
    entitiesIds.forEach((id) => (cacheKeys[cacheKeyFormatter(id)] = '1'))
    return this.cacheService.setMultiple(cacheKeys, this.timeout)
  }

  async cacheEntity(id: string, cacheKeyFormatter: KeyFormatter) {
    return this.cacheService.set(cacheKeyFormatter(id), '1', this.timeout)
  }

  private formatCompanyCacheKey: KeyFormatter = (cui: string) => `osint.termene.companies[${cui}]`
  private formatProceedingCacheKey: KeyFormatter = (fileNumber: string) =>
    `osint.termene.proceedings[${fileNumber}]`
}
