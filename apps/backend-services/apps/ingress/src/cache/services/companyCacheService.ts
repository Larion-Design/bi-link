import { Injectable } from '@nestjs/common'
import { CompanyDocument } from '../../entities/company/models/companyModel'
import { CacheService } from '@app/cache/cacheService'

@Injectable()
export class CompanyCacheService {
  private readonly key = 'cachedCompanies'

  constructor(private readonly cacheService: CacheService) {}

  async getCachedCompanyId(fieldValue: string) {
    return this.cacheService.getHashKey(this.key, fieldValue)
  }

  async cacheCompanyId(company: CompanyDocument) {
    const map = new Map<string, string>()
    const companyId = String(company._id)

    const {
      name: { value: name },
      cui: { value: cui },
      registrationNumber: { value: registrationNumber },
      contactDetails,
    } = company

    if (name.length) {
      map.set(name, companyId)
    }
    if (cui.length) {
      map.set(cui, companyId)
    }
    if (registrationNumber.length) {
      map.set(registrationNumber, companyId)
    }

    contactDetails.forEach(({ fieldValue }) => {
      if (fieldValue.length) {
        map.set(fieldValue, companyId)
      }
    })

    if (map.size) {
      return this.cacheService.setHashKeys(this.key, Object.fromEntries(map))
    }
  }
}
