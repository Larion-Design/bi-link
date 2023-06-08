import { MICROSERVICES } from '@app/rpc'
import { IngressServiceMethods } from '@app/rpc/microservices/ingress'
import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { PersonCacheService } from '../../cache'
import { PersonsService } from '../../entities/person/services/personsService'

type Params = Parameters<IngressServiceMethods['findPersonId']>[0]

@Controller()
export class FindPersonId {
  private readonly logger = new Logger(FindPersonId.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly personCacheService: PersonCacheService,
  ) {}

  @MessagePattern(MICROSERVICES.INGRESS.getEntities)
  async findPersonId(
    @Payload()
    { firstName, lastName, birthdate, cnp, documentNumber, dataSource }: Params,
  ) {
    if (dataSource?.length) {
      return this.findPersonByDataSource(dataSource)
    }
    if (cnp?.length) {
      return this.findPersonByCNP(cnp)
    }
    if (documentNumber?.length) {
      return this.findPersonByDocumentNumber(documentNumber)
    }
    if (firstName?.length && lastName?.length && birthdate) {
      return this.findPersonByNameAndBirthdate(firstName, lastName, birthdate)
    }
  }

  private findPersonByDataSource = async (dataSource: string) => {
    const cachedPersonId = await this.personCacheService.getCachedPersonId(dataSource)

    if (!cachedPersonId) {
      const personDocument = await this.personsService.findByMetadataSourceUrl(dataSource)

      if (personDocument) {
        await this.personCacheService.cachePersonId(personDocument)
        return String(personDocument._id)
      }
    }
    return cachedPersonId
  }

  private findPersonByCNP = async (cnp: string) => {
    const cachedPersonId = await this.personCacheService.getCachedPersonId(cnp)

    if (!cachedPersonId) {
      const personDocument = await this.personsService.findByCNP(cnp)

      if (personDocument) {
        await this.personCacheService.cachePersonId(personDocument)
        return String(personDocument._id)
      }
    }
    return cachedPersonId
  }

  private findPersonByDocumentNumber = async (documentNumber: string) => {
    const cachedPersonId = await this.personCacheService.getCachedPersonId(documentNumber)

    if (!cachedPersonId) {
      const personDocument = await this.personsService.findByDocumentNumber(documentNumber)

      if (personDocument) {
        await this.personCacheService.cachePersonId(personDocument)
        return String(personDocument._id)
      }
    }
    return cachedPersonId
  }

  private findPersonByNameAndBirthdate = async (
    firstName: string,
    lastName: string,
    birthdate: Date,
  ) => {
    const cachedPersonId = await this.personCacheService.getCachedPersonId(
      this.personCacheService.getPersonNameAndBirthdateCacheKey(firstName, lastName, birthdate),
    )

    if (!cachedPersonId) {
      const personDocument = await this.personsService.findByNameAndBirthdate(
        firstName,
        lastName,
        birthdate,
      )

      if (personDocument) {
        await this.personCacheService.cachePersonId(personDocument)
        return String(personDocument._id)
      }
    }
    return cachedPersonId
  }
}
