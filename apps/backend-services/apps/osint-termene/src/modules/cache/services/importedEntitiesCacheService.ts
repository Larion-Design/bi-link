import { CacheService } from '@app/cache'
import { Injectable, Logger } from '@nestjs/common'

type KeyFormatter = (id: string) => string

@Injectable()
export class ImportedEntitiesCacheService {
  private readonly logger = new Logger(ImportedEntitiesCacheService.name)

  private readonly timeout = 3600

  constructor(private readonly cacheService: CacheService) {}

  async getNewPersons(personsUrls: string[]) {
    return this.getNewEntities(personsUrls, this.formatPersonCacheKey)
  }

  async getNewCompanies(companiesCUI: string[]) {
    return this.getNewEntities(companiesCUI, this.formatCompanyCacheKey)
  }

  async getNewProceedings(fileNumbers: string[]) {
    return this.getNewEntities(fileNumbers, this.formatProceedingCacheKey)
  }

  async cachePersons(personsUrls: string[]) {
    return this.cacheEntities(personsUrls, this.formatPersonCacheKey)
  }

  async cacheCompanies(companiesCUI: string[]) {
    return this.cacheEntities(companiesCUI, this.formatCompanyCacheKey)
  }

  async cacheProceedings(fileNumbers: string[]) {
    return this.cacheEntities(fileNumbers, this.formatProceedingCacheKey)
  }

  private async getNewEntities(entitiesIds: string[], cacheKeyFormatter: KeyFormatter) {
    const cachedEntitiesList = await this.cacheService.getMultiple(
      entitiesIds.map(cacheKeyFormatter),
    )
    return entitiesIds.filter((id) => {
      if (cacheKeyFormatter(id) in cachedEntitiesList) {
        this.logger.debug(`Entity ${id} is already cached.`)
        return false
      }
      return true
    })
  }

  private async cacheEntities(entitiesIds: string[], cacheKeyFormatter: KeyFormatter) {
    const cacheKeys: Record<string, string> = {}
    entitiesIds.forEach((id) => (cacheKeys[cacheKeyFormatter(id)] = '1'))
    return this.cacheService.setMultiple(cacheKeys, this.timeout)
  }

  private formatCompanyCacheKey: KeyFormatter = (cui: string) => `osint.termene.companies[${cui}]`
  private formatProceedingCacheKey: KeyFormatter = (fileNumber: string) =>
    `osint.termene.proceedings[${fileNumber}]`
  private formatPersonCacheKey: KeyFormatter = (personUrl: string) =>
    `osint.termene.persons[${personUrl}]`
}
