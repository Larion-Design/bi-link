import { MICROSERVICES } from '@app/rpc'
import { IngressServiceMethods } from '@app/rpc/microservices/ingress'
import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CompaniesService } from '../../entities/company/services/companiesService'

type Params = Parameters<IngressServiceMethods['findCompanyId']>[0]

@Controller()
export class FindCompanyId {
  private readonly logger = new Logger(FindCompanyId.name)

  constructor(private readonly companiesService: CompaniesService) {}

  @MessagePattern(MICROSERVICES.INGRESS.findCompanyId)
  async findCompanyId(@Payload() { name, cui, registrationNumber }: Params) {
    if (name) {
      return this.companiesService.findByName(name)
    }
    if (cui) {
      return this.companiesService.findByName(cui)
    }
    if (registrationNumber) {
      return this.companiesService.findByName(registrationNumber)
    }
  }
}
