import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'
import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { CompanyProducerService } from '../../scheduler/companies/companyProducerService'

type Params = Parameters<OsintTermeneServiceConfig['importCompany']>[0]

@Controller()
export class ImportCompany {
  constructor(private readonly companyProducerService: CompanyProducerService) {}

  @EventPattern(MICROSERVICES.OSINT.TERMENE.importCompany)
  async importCompany(@Payload() cui: Params) {
    return this.companyProducerService.importCompanies([cui], true)
  }
}
