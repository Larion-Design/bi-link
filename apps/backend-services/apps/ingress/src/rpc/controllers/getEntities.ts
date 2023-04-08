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

@Controller()
export class GetEntities {
  private readonly logger = new Logger(GetEntities.name)

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

  @MessagePattern(MICROSERVICES.INGRESS.getEntities)
  async createEntity(
    @Payload()
    {
      entitiesIds,
      entitiesType,
      fetchLinkedEntities,
      source,
    }: Parameters<IngressServiceMethods['getEntities']>[0],
  ) {
    switch (entitiesType) {
      case 'PERSON': {
        return this.personsService.getPersons(entitiesIds, fetchLinkedEntities)
      }
      case 'COMPANY': {
        return this.companiesService.getCompanies(entitiesIds, fetchLinkedEntities)
      }
      case 'PROPERTY': {
        return this.propertiesService.getProperties(entitiesIds, fetchLinkedEntities)
      }
      case 'EVENT': {
        return this.eventsService.getEvents(entitiesIds, fetchLinkedEntities)
      }
      case 'PROCEEDING': {
        return this.proceedingsService.getProceedings(entitiesIds, fetchLinkedEntities)
      }
      case 'FILE': {
        return this.filesService.getFiles(entitiesIds)
      }
      case 'REPORT': {
        return this.reportsService.getReports(entitiesIds, fetchLinkedEntities)
      }
      case 'LOCATION': {
        return this.locationsService.getLocations(entitiesIds)
      }
    }
  }
}
