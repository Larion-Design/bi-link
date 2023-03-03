import { CompaniesService } from '@app/models/services/companiesService'
import { EventsService } from '@app/models/services/eventsService'
import { PersonsService } from '@app/models/services/personsService'
import { PropertiesService } from '@app/models/services/propertiesService'
import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { EntityInfo, MICROSERVICES } from '@app/pub/constants'
import { EntityType } from 'defs'
import { CompanyDispatcherService } from '../producers/services/companyDispatcherService'
import { EventDispatcherService } from '../producers/services/eventDispatcherService'
import { PersonDispatcherService } from '../producers/services/personDispatcherService'
import { PropertyDispatcherService } from '../producers/services/propertyDispatcherService'

@Controller()
export class EntityEventsController {
  private readonly logger = new Logger(EntityEventsController.name)

  constructor(
    private readonly personEventDispatcherService: PersonDispatcherService,
    private readonly companyEventDispatcherService: CompanyDispatcherService,
    private readonly propertyEventDispatcherService: PropertyDispatcherService,
    private readonly eventDispatcherService: EventDispatcherService,

    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly propertiesService: PropertiesService,
    private readonly eventsService: EventsService,
  ) {}

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entityCreated)
  async entityCreated(@Payload() entityInfo: EntityInfo) {
    this.logger.debug(`Adding ${entityInfo.entityType}:${entityInfo.entityId} to graph`)
    return this.scheduleGraphUpdate(entityInfo)
  }

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entityModified)
  async entityModified(@Payload() entityInfo: EntityInfo) {
    this.logger.debug(`Updating ${entityInfo.entityType}:${entityInfo.entityId} in graph`)
    return this.scheduleGraphUpdate(entityInfo)
  }

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entitiesRefresh)
  async entitiesRefresh(@Payload() entityType: EntityType) {
    return this.refreshAllGraphEntitiesByType(entityType)
  }

  @EventPattern(MICROSERVICES.GRAPH.entitiesRefresh)
  async graphEntitiesRefresh(@Payload() entityType: EntityType) {
    return this.refreshAllGraphEntitiesByType(entityType)
  }

  private readonly refreshAllGraphEntitiesByType = async (entityType: EntityType) => {
    switch (entityType) {
      case 'PERSON': {
        const personsIds = await this.getAllPersons()

        if (personsIds.length) {
          this.logger.debug(`Refreshing ${personsIds.length} persons in graph`)
          return this.personEventDispatcherService.dispatchPersonsUpdated(personsIds)
        } else {
          this.logger.debug(`No persons to refresh in graph`)
        }
        break
      }
      case 'COMPANY': {
        const companiesIds = await this.getAllCompanies()

        if (companiesIds.length) {
          this.logger.debug(`Refreshing ${companiesIds.length} companies in graph`)
          return this.companyEventDispatcherService.dispatchCompaniesUpdated(companiesIds)
        } else {
          this.logger.debug(`No companies to refresh in graph`)
        }
        break
      }
      case 'EVENT': {
        const eventsIds = await this.getAllEvents()

        if (eventsIds.length) {
          this.logger.debug(`Refreshing ${eventsIds.length} events in graph`)
          return this.eventDispatcherService.dispatchEventsUpdated(eventsIds)
        } else {
          this.logger.debug(`No events to refresh in graph`)
        }
        break
      }
      case 'PROPERTY': {
        const propertiesIds = await this.getAllProperties()

        if (propertiesIds.length) {
          this.logger.debug(`Refreshing ${propertiesIds.length} properties in graph`)
          return this.propertyEventDispatcherService.dispatchPropertiesUpdated(propertiesIds)
        } else {
          this.logger.debug(`No properties to refresh in graph`)
        }
        break
      }
    }
  }

  private readonly scheduleGraphUpdate = async ({ entityId, entityType }: EntityInfo) => {
    switch (entityType) {
      case 'PERSON': {
        return this.personEventDispatcherService.dispatchPersonUpdated(entityId)
      }
      case 'COMPANY': {
        return this.companyEventDispatcherService.dispatchCompanyUpdated(entityId)
      }
      case 'EVENT': {
        return this.eventDispatcherService.dispatchEventUpdated(entityId)
      }
      case 'PROPERTY': {
        return this.propertyEventDispatcherService.dispatchPropertyUpdated(entityId)
      }
    }
  }

  private getAllPersons = async () => {
    const entitiesIds: string[] = []

    for await (const { _id } of this.personsService.getAllPersons()) {
      entitiesIds.push(String(_id))
    }
    return entitiesIds
  }

  private getAllCompanies = async () => {
    const entitiesIds: string[] = []

    for await (const { _id } of this.companiesService.getAllCompanies()) {
      entitiesIds.push(String(_id))
    }
    return entitiesIds
  }

  private getAllProperties = async () => {
    const entitiesIds: string[] = []

    for await (const { _id } of this.propertiesService.getAllProperties()) {
      entitiesIds.push(String(_id))
    }
    return entitiesIds
  }

  private getAllEvents = async () => {
    const entitiesIds: string[] = []

    for await (const { _id } of this.eventsService.getAllEvents()) {
      entitiesIds.push(String(_id))
    }
    return entitiesIds
  }
}
