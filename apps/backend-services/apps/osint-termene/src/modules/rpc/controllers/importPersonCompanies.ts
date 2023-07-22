import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'
import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { PersonProducerService } from '../../scheduler/persons/personProducerService'

type Params = Parameters<OsintTermeneServiceConfig['importPersonCompanies']>[0]

@Controller()
export class ImportPersonCompanies {
  constructor(private readonly personProducerService: PersonProducerService) {}

  @EventPattern(MICROSERVICES.OSINT.TERMENE.importPersonCompanies)
  async importPerson(@Payload() url: Params) {
    return this.personProducerService.extractPersonsCompanies([url], true)
  }
}
