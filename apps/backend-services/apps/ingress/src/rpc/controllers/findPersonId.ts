import { MICROSERVICES } from '@app/rpc'
import { IngressServiceMethods } from '@app/rpc/microservices/ingress'
import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PersonsService } from '../../entities/person/services/personsService'

type Params = Parameters<IngressServiceMethods['findPersonId']>[0]

@Controller()
export class FindPersonId {
  private readonly logger = new Logger(FindPersonId.name)

  constructor(private readonly personsService: PersonsService) {}

  @MessagePattern(MICROSERVICES.INGRESS.getEntities)
  async findPersonId(
    @Payload()
    { firstName, lastName, birthdate, cnp, documentNumber, dataSource }: Params,
  ) {
    if (dataSource) {
      return this.personsService.findByMetadataSourceUrl(dataSource)
    }
    if (cnp) {
      return this.personsService.findByCNP(cnp)
    }
    if (documentNumber) {
      return this.personsService.findByDocumentNumber(documentNumber)
    }
    if (firstName && lastName) {
      return this.personsService.findByPersonalInfo(firstName, lastName, birthdate)
    }
  }
}
