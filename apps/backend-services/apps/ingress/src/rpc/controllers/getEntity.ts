import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MICROSERVICES } from '@app/rpc'
import { IngressServiceMethods } from '@app/rpc/microservices/ingress'
import { CompaniesService } from '../../entities/company/services/companiesService'
import { EventsService } from '../../entities/event/services/eventsService'
import { FilesService } from '../../entities/file/services/filesService'
import { LocationsService } from '../../entities/location/services/locationsService'
import { PersonsService } from '../../entities/person/services/personsService'
import { ProceedingsService } from '../../entities/proceeding/services/proceedingsService'
import { PropertiesService } from '../../entities/property/services/propertiesService'
import { ReportsService } from '../../entities/report/services/reportsService'

type Params = Parameters<IngressServiceMethods['getEntity']>[0]
type Result = ReturnType<IngressServiceMethods['getEntity']> | undefined | null

@Controller()
export class GetEntity {
  private readonly logger = new Logger(GetEntity.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly filesService: FilesService,
    private readonly propertiesService: PropertiesService,
    private readonly eventsService: EventsService,
    private readonly proceedingsService: ProceedingsService,
    private readonly reportsService: ReportsService,
    private readonly locationsService: LocationsService,
  ) {}

  @MessagePattern(MICROSERVICES.INGRESS.getEntity)
  async createEntity(
    @Payload() { entityInfo, fetchLinkedEntities, source }: Params,
  ): Promise<Result> {
    const { entityId, entityType } = entityInfo

    switch (entityType) {
      case 'PERSON': {
        return this.personsService.find(entityId, fetchLinkedEntities)
      }
      case 'COMPANY': {
        return this.companiesService.getCompany(entityId, fetchLinkedEntities)
      }
      case 'PROPERTY': {
        return this.propertiesService.getProperty(entityId, fetchLinkedEntities)
      }
      case 'EVENT': {
        return this.eventsService.getEvent(entityId, fetchLinkedEntities)
      }
      case 'PROCEEDING': {
        return this.proceedingsService.getProceeding(entityId, fetchLinkedEntities)
      }
      case 'FILE': {
        return this.filesService.getFile(entityId)
      }
      case 'REPORT': {
        return this.reportsService.getReport(entityId, fetchLinkedEntities)
      }
      case 'LOCATION': {
        return this.locationsService.getLocation(entityId)
      }
    }
  }
}
