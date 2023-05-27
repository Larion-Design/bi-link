import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'
import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { PersonProducerService } from '../../scheduler/producers/personProducerService'

type Params = Parameters<OsintTermeneServiceConfig['importPerson']>[0]

@Controller()
export class ImportPerson {
  constructor(private readonly personProducerService: PersonProducerService) {}

  @EventPattern(MICROSERVICES.OSINT.TERMENE.importPerson)
  async importPerson(@Payload() url: Params) {
    return this.personProducerService.extractPersonCompanies(url)
  }
}
