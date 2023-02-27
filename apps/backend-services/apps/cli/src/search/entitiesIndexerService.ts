import { EventsService } from '@app/entities/services/eventsService'
import { Injectable } from '@nestjs/common'
import { CompaniesService } from '@app/entities/services/companiesService'
import { PersonsService } from '@app/entities/services/personsService'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { EntityEventsService } from '@app/pub/services/entityEventsService'

@Injectable()
export class EntitiesIndexerService {
  constructor(
    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly propertiesService: PropertiesService,
    private readonly eventsService: EventsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  indexAllPersons = async () => {
    for await (const { _id } of this.personsService.getAllPersons()) {
      this.entityEventsService.emitEntityModified({ entityId: String(_id), entityType: 'PERSON' })
    }
  }

  indexAllCompanies = async () => {
    for await (const { _id } of this.companiesService.getAllCompanies()) {
      this.entityEventsService.emitEntityModified({ entityId: String(_id), entityType: 'COMPANY' })
    }
  }

  indexAllProperties = async () => {
    for await (const { _id } of this.propertiesService.getAllProperties()) {
      this.entityEventsService.emitEntityModified({ entityId: String(_id), entityType: 'PROPERTY' })
    }
  }

  indexAllEvents = async () => {
    for await (const { _id } of this.eventsService.getAllEvents()) {
      this.entityEventsService.emitEntityModified({ entityId: String(_id), entityType: 'EVENT' })
    }
  }
}
