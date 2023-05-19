import { Inject, Injectable } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CompanyAPIInput, UpdateSource } from 'defs'

@Injectable()
export class CompanyLoaderService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly ingressService: IngressService,
  ) {}

  findCompany = async (
    name: string | null = null,
    cui: string | null = null,
    registrationNumber: string | null = null,
  ) => {
    const cachedCompanyId = await this.cacheManager.get<string>(
      String(cui ?? name ?? registrationNumber),
    )

    if (!cachedCompanyId) {
      const companyId = await this.ingressService.findCompanyId({ cui, name, registrationNumber })

      if (companyId) {
        const cacheKeys: string[] = []
        if (name) cacheKeys.push(name)
        if (cui) cacheKeys.push(cui)
        if (registrationNumber) cacheKeys.push(registrationNumber)

        await Promise.all(
          cacheKeys.map((key) => this.cacheManager.set(key, companyId, { ttl: 600 })),
        )
      }
      return companyId
    }
  }

  createCompany = async (companyInfo: CompanyAPIInput, author: UpdateSource) => {
    const companyId = await this.ingressService.createEntity('COMPANY', companyInfo, author)

    if (companyId) {
      const {
        name: { value: nameValue },
        cui: { value: cuiValue },
        registrationNumber: { value: registrationNumberValue },
      } = companyInfo

      const cacheKeys: string[] = []
      if (nameValue.length) cacheKeys.push(nameValue)
      if (cuiValue.length) cacheKeys.push(cuiValue)
      if (registrationNumberValue.length) cacheKeys.push(registrationNumberValue)

      await Promise.all(cacheKeys.map((key) => this.cacheManager.set(key, companyId, { ttl: 600 })))
    }
    return companyId
  }
}
