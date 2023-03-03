import { CompaniesService } from '@app/models/services/companiesService'
import { EventsService } from '@app/models/services/eventsService'
import { PersonsService } from '@app/models/services/personsService'
import { PropertiesService } from '@app/models/services/propertiesService'
import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { EntityInfo, MICROSERVICES } from '@app/rpc/constants'
import { EntityType } from 'defs'
import { CompanyEventDispatcherService } from '../producers/services/companyEventDispatcherService'
import { PersonEventDispatcherService } from '../producers/services/personEventDispatcherService'
import { EventDispatcherService } from '../producers/services/eventDispatcherService'
import { RelatedEntitiesSearchService } from '../producers/services/relatedEntitiesSearchService'
import { FileEventDispatcherService } from '../producers/services/fileEventDispatcherService'
import { PropertyEventDispatcherService } from '../producers/services/propertyEventDispatcherService'
import { ReportEventDispatcherService } from '../producers/services/reportEventDispatcherService'

@Controller()
export class EntityEventsRPCController {
  private readonly logger = new Logger(EntityEventsRPCController.name)

  constructor(
    private readonly companyEventDispatcherService: CompanyEventDispatcherService,
    private readonly personEventDispatcherService: PersonEventDispatcherService,
    private readonly propertyEventDispatcherService: PropertyEventDispatcherService,
    private readonly eventEventDispatcherService: EventDispatcherService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
    private readonly reportEventDispatcherService: ReportEventDispatcherService,
    private readonly relatedEntitiesSearchService: RelatedEntitiesSearchService,

    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly propertiesService: PropertiesService,
    private readonly eventsService: EventsService,
  ) {}

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entityModified)
  async entityModified(@Payload() entityInfo: EntityInfo) {
    return this.indexEntityAndRelatedEntities(entityInfo)
  }

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entityCreated)
  async entityCreated(@Payload() { entityId, entityType }: EntityInfo) {
    switch (entityType) {
      case 'PERSON': {
        return this.personEventDispatcherService.dispatchPersonCreated(entityId)
      }
      case 'COMPANY': {
        return this.companyEventDispatcherService.dispatchCompanyCreated(entityId)
      }
      case 'PROPERTY': {
        return this.propertyEventDispatcherService.dispatchPropertyCreated(entityId)
      }
      case 'EVENT': {
        return this.eventEventDispatcherService.dispatchEventCreated(entityId)
      }
      case 'FILE': {
        return this.fileEventDispatcherService.dispatchFileCreated({ fileId: entityId })
      }
      case 'REPORT': {
        return this.reportEventDispatcherService.dispatchReportCreated({ reportId: entityId })
      }
    }
  }

  @EventPattern(MICROSERVICES.INDEXER.indexEntity)
  async indexEntity(@Payload() entityInfo: EntityInfo) {
    return this.indexEntityAndRelatedEntities(entityInfo)
  }

  @EventPattern(MICROSERVICES.INDEXER.entitiesRefresh)
  async indexEntitiesRefresh(@Payload() entityType: EntityType) {
    return this.refreshAllIndexEntitiesByType(entityType)
  }

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entitiesRefresh)
  async entitiesRefresh(@Payload() entityType: EntityType) {
    return this.refreshAllIndexEntitiesByType(entityType)
  }

  private indexEntityAndRelatedEntities = async ({ entityId, entityType }: EntityInfo) => {
    let relatedCompaniesIds: string[]
    let relatedEventsIds: string[]
    let relatedPropertiesIds: string[]

    switch (entityType) {
      case 'PERSON': {
        relatedCompaniesIds = await this.relatedEntitiesSearchService.getCompaniesRelatedToPerson(
          entityId,
        )
        relatedPropertiesIds = await this.relatedEntitiesSearchService.getPropertiesRelatedToPerson(
          entityId,
        )
        relatedEventsIds = await this.relatedEntitiesSearchService.getEventsRelatedToPerson(
          entityId,
        )

        await this.personEventDispatcherService.dispatchPersonUpdated(entityId)
        break
      }
      case 'COMPANY': {
        relatedCompaniesIds = await this.relatedEntitiesSearchService.getCompaniesRelatedToCompany(
          entityId,
        )
        relatedPropertiesIds =
          await this.relatedEntitiesSearchService.getPropertiesRelatedToCompany(entityId)
        await this.companyEventDispatcherService.dispatchCompanyUpdated(entityId)
        break
      }
      case 'PROPERTY': {
        relatedEventsIds = await this.relatedEntitiesSearchService.getEventsRelatedToProperty(
          entityId,
        )
        await this.propertyEventDispatcherService.dispatchPropertyUpdated(entityId)
        break
      }
      case 'EVENT': {
        return this.eventEventDispatcherService.dispatchEventUpdated(entityId)
      }
      case 'FILE': {
        return this.fileEventDispatcherService.dispatchFileCreated({ fileId: entityId })
      }
      case 'REPORT': {
        return this.reportEventDispatcherService.dispatchReportUpdated({ reportId: entityId })
      }
    }

    const dispatchedEvents = []

    if (relatedCompaniesIds?.length) {
      dispatchedEvents.push(
        this.companyEventDispatcherService.dispatchCompaniesUpdated(relatedCompaniesIds),
      )
    }
    if (relatedEventsIds?.length) {
      dispatchedEvents.push(
        this.eventEventDispatcherService.dispatchEventsUpdated(relatedEventsIds),
      )
    }
    if (relatedPropertiesIds.length) {
      dispatchedEvents.push(
        this.propertyEventDispatcherService.dispatchPropertiesUpdated(relatedPropertiesIds),
      )
    }

    if (dispatchedEvents.length) {
      await Promise.all(dispatchedEvents)
    }
  }

  private refreshAllIndexEntitiesByType = async (entityType: EntityType) => {
    switch (entityType) {
      case 'PERSON': {
        const personsIds = await this.getAllPersons()

        if (personsIds.length) {
          this.logger.debug(`Refreshing ${personsIds.length} persons in index`)
          return this.personEventDispatcherService.dispatchPersonsUpdated(personsIds)
        } else {
          this.logger.debug(`No persons to refresh in index`)
        }
        break
      }
      case 'COMPANY': {
        const companiesIds = await this.getAllCompanies()

        if (companiesIds.length) {
          this.logger.debug(`Refreshing ${companiesIds.length} companies in index`)
          return this.companyEventDispatcherService.dispatchCompaniesUpdated(companiesIds)
        } else {
          this.logger.debug(`No companies to refresh in index`)
        }
        break
      }
      case 'EVENT': {
        const eventsIds = await this.getAllEvents()

        if (eventsIds.length) {
          this.logger.debug(`Refreshing ${eventsIds.length} events in index`)
          return this.eventEventDispatcherService.dispatchEventsUpdated(eventsIds)
        } else {
          this.logger.debug(`No events to refresh in index`)
        }
        break
      }
      case 'PROPERTY': {
        const propertiesIds = await this.getAllProperties()

        if (propertiesIds.length) {
          this.logger.debug(`Refreshing ${propertiesIds.length} properties in index`)
          return this.propertyEventDispatcherService.dispatchPropertiesUpdated(propertiesIds)
        } else {
          this.logger.debug(`No properties to refresh in index`)
        }
        break
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
