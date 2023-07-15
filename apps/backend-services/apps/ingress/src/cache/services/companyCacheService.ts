import { Injectable } from '@nestjs/common'
import { Company } from 'defs'
import { CompanyDocument } from '../../entities/company/models/companyModel'
import { CacheService } from './cacheService'

@Injectable()
export class CompanyCacheService {
  private readonly key = 'cachedCompanies'

  constructor(private readonly cacheService: CacheService) {}

  async getCachedCompanyId(fieldValue: string) {
    return this.cacheService.getHashKey(this.key, fieldValue)
  }

  async cacheCompanyId(company: CompanyDocument) {
    const set = new Set<string>()
    const {
      name: { value: name },
      cui: { value: cui },
      registrationNumber: { value: registrationNumber },
      contactDetails,
    } = company

    if (name.length) {
      set.add(name)
    }
    if (cui.length) {
      set.add(cui)
    }
    if (registrationNumber.length) {
      set.add(registrationNumber)
    }

    contactDetails.forEach(({ fieldValue }) => {
      if (fieldValue.length) {
        set.add(fieldValue)
      }
    })

    if (set.size) {
      const companyId = String(company._id)
      const map: Record<string, string> = {}
      set.forEach((cacheKey) => (map[cacheKey] = companyId))
      return this.cacheService.setHashKeys(this.key, map)
    }
  }
}
