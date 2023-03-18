import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { ReportsService } from '@app/models'
import { CompaniesService } from '@app/models/services/companiesService'
import { EventsService } from '@app/models/services/eventsService'
import { PersonsService } from '@app/models/services/personsService'
import { ProceedingsService } from '@app/models/services/proceedingsService'
import { PropertiesService } from '@app/models/services/propertiesService'
import { EntityInfo, MICROSERVICES } from '@app/rpc/constants'
import { EntityType } from 'defs'
import { CompanyEventDispatcherService } from '../producers/services/companyEventDispatcherService'
import { PersonEventDispatcherService } from '../producers/services/personEventDispatcherService'
import { EventDispatcherService } from '../producers/services/eventDispatcherService'
import { ProceedingEventDispatcherService } from '../producers/services/proceedingEventDispatcherService'
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
    private readonly proceedingEventDispatcherService: ProceedingEventDispatcherService,
    private readonly relatedEntitiesSearchService: RelatedEntitiesSearchService,

    private readonly personsService: PersonsService,
    private readonly companiesService: CompaniesService,
    private readonly propertiesService: PropertiesService,
    private readonly eventsService: EventsService,
    private readonly reportsService: ReportsService,
    private readonly proceedingsService: ProceedingsService,
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
        return this.fileEventDispatcherService.dispatchFileCreated(entityId)
      }
      case 'REPORT': {
        return this.reportEventDispatcherService.dispatchReportCreated(entityId)
      }
      case 'PROCEEDING': {
        return this.proceedingEventDispatcherService.dispatchProceedingCreated(entityId)
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
        return this.fileEventDispatcherService.dispatchFileUpdated(entityId)
      }
      case 'REPORT': {
        return this.reportEventDispatcherService.dispatchReportUpdated(entityId)
      }
      case 'PROCEEDING': {
        return this.proceedingEventDispatcherService.dispatchProceedingUpdated(entityId)
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
        const entitiesIds = await this.getAllPersons()

        if (entitiesIds.length) {
          this.logger.debug(`Refreshing ${entitiesIds.length} persons in index`)
          return this.personEventDispatcherService.dispatchPersonsUpdated(entitiesIds)
        } else {
          this.logger.debug(`No persons to refresh in index`)
        }
        break
      }
      case 'COMPANY': {
        const entitiesIds = await this.getAllCompanies()

        if (entitiesIds.length) {
          this.logger.debug(`Refreshing ${entitiesIds.length} companies in index`)
          return this.companyEventDispatcherService.dispatchCompaniesUpdated(entitiesIds)
        } else {
          this.logger.debug(`No companies to refresh in index`)
        }
        break
      }
      case 'EVENT': {
        const entitiesIds = await this.getAllEvents()

        if (entitiesIds.length) {
          this.logger.debug(`Refreshing ${entitiesIds.length} events in index`)
          return this.eventEventDispatcherService.dispatchEventsUpdated(entitiesIds)
        } else {
          this.logger.debug(`No events to refresh in index`)
        }
        break
      }
      case 'PROPERTY': {
        const entitiesIds = await this.getAllProperties()

        if (entitiesIds.length) {
          this.logger.debug(`Refreshing ${entitiesIds.length} properties in index`)
          return this.propertyEventDispatcherService.dispatchPropertiesUpdated(entitiesIds)
        } else {
          this.logger.debug(`No properties to refresh in index`)
        }
        break
      }
      case 'REPORT': {
        const entitiesIds = await this.getAllReports()

        if (entitiesIds.length) {
          this.logger.debug(`Refreshing ${entitiesIds.length} reports in index`)
          return this.reportEventDispatcherService.dispatchReportsUpdated(entitiesIds)
        } else {
          this.logger.debug(`No reports to refresh in index`)
        }
        break
      }
      case 'PROCEEDING': {
        const entitiesIds = await this.getAllProceedings()

        if (entitiesIds.length) {
          this.logger.debug(`Refreshing ${entitiesIds.length} proceedings in index`)
          return this.proceedingEventDispatcherService.dispatchProceedingsUpdated(entitiesIds)
        } else {
          this.logger.debug(`No proceedings to refresh in index`)
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

  private getAllReports = async () => {
    const entitiesIds: string[] = []

    for await (const { _id } of this.reportsService.getAllReports()) {
      entitiesIds.push(String(_id))
    }
    return entitiesIds
  }

  private getAllProceedings = async () => {
    const entitiesIds: string[] = []

    for await (const { _id } of this.proceedingsService.getAllProceedings()) {
      entitiesIds.push(String(_id))
    }
    return entitiesIds
  }
}
