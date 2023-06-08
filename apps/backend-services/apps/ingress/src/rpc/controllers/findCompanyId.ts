import { MICROSERVICES } from '@app/rpc'
import { IngressServiceMethods } from '@app/rpc/microservices/ingress'
import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CompanyCacheService } from '../../cache'
import { CompanyDocument } from '../../entities/company/models/companyModel'
import { CompaniesService } from '../../entities/company/services/companiesService'

type Params = Parameters<IngressServiceMethods['findCompanyId']>[0]

@Controller()
export class FindCompanyId {
  private readonly logger = new Logger(FindCompanyId.name)

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly companyCacheService: CompanyCacheService,
  ) {}

  @MessagePattern(MICROSERVICES.INGRESS.findCompanyId)
  async findCompanyId(@Payload() { name, cui, registrationNumber }: Params) {
    const cachedCompanyId = await this.companyCacheService.getCachedCompanyId(
      String(name ?? cui ?? registrationNumber),
    )

    if (!cachedCompanyId) {
      let companyDocument: CompanyDocument | null = null

      if (name) {
        companyDocument = await this.companiesService.findByName(name)
      } else if (cui) {
        companyDocument = await this.companiesService.findByCUI(cui)
      } else if (registrationNumber) {
        companyDocument = await this.companiesService.findByRegistrationNumber(registrationNumber)
      }

      if (companyDocument) {
        await this.companyCacheService.cacheCompanyId(companyDocument)
        return String(companyDocument._id)
      }
    }
    return cachedCompanyId
  }
}
