import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { IngressService } from '@app/rpc/microservices/ingress'
import { MICROSERVICES } from '@app/rpc/constants'
import { ActivityEventInput, EntityInfo, EntityType } from 'defs'
import { HistoryIndexerService } from '../indexer/services'
import { CompanyEventDispatcherService } from '../producers/services/companyEventDispatcherService'
import { PersonEventDispatcherService } from '../producers/services/personEventDispatcherService'
import { EventDispatcherService } from '../producers/services/eventDispatcherService'
import { ProceedingEventDispatcherService } from '../producers/services/proceedingEventDispatcherService'
import { RelatedEntitiesSearchService } from '../producers/services/relatedEntitiesSearchService'
import { FileEventDispatcherService } from '../producers/services/fileEventDispatcherService'
import { PropertyEventDispatcherService } from '../producers/services/propertyEventDispatcherService'
import { ReportEventDispatcherService } from '../producers/services/reportEventDispatcherService'

@Controller()
export class IndexerController {
  private readonly logger = new Logger(IndexerController.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly companyEventDispatcherService: CompanyEventDispatcherService,
    private readonly personEventDispatcherService: PersonEventDispatcherService,
    private readonly propertyEventDispatcherService: PropertyEventDispatcherService,
    private readonly eventEventDispatcherService: EventDispatcherService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
    private readonly reportEventDispatcherService: ReportEventDispatcherService,
    private readonly proceedingEventDispatcherService: ProceedingEventDispatcherService,
    private readonly relatedEntitiesSearchService: RelatedEntitiesSearchService,
    private readonly historyIndexerService: HistoryIndexerService,
  ) {}

  @EventPattern(MICROSERVICES.GLOBAL.entityModified)
  async entityModified(@Payload() entityInfo: EntityInfo) {
    return this.indexEntityAndRelatedEntities(entityInfo)
  }

  @EventPattern(MICROSERVICES.GLOBAL.entityCreated)
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
  async indexEntity(@Payload() entityInfo: EntityInfo): Promise<void> {
    return this.indexEntityAndRelatedEntities(entityInfo)
  }

  @EventPattern(MICROSERVICES.INDEXER.reindexEntities)
  async indexEntitiesRefresh(@Payload() entityType: EntityType) {
    return this.refreshAllIndexEntitiesByType(entityType)
  }

  @EventPattern(MICROSERVICES.GLOBAL.entitiesRefreshed)
  async entitiesRefresh(@Payload() entityType: EntityType) {
    return this.refreshAllIndexEntitiesByType(entityType)
  }

  async recordHistoryEvent(@Payload() data: ActivityEventInput) {
    return this.historyIndexerService.indexEvent(data)
  }

  private indexEntityAndRelatedEntities = async ({ entityId, entityType }: EntityInfo) => {
    let relatedCompaniesIds: string[] | undefined
    let relatedEventsIds: string[] | undefined
    let relatedPropertiesIds: string[] | undefined

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

    if (relatedCompaniesIds?.length) {
      void this.companyEventDispatcherService.dispatchCompaniesUpdated(relatedCompaniesIds)
    }
    if (relatedEventsIds?.length) {
      void this.eventEventDispatcherService.dispatchEventsUpdated(relatedEventsIds)
    }
    if (relatedPropertiesIds?.length) {
      void this.propertyEventDispatcherService.dispatchPropertiesUpdated(relatedPropertiesIds)
    }
  }

  private refreshAllIndexEntitiesByType = async (entityType: EntityType) => {
    const entitiesIds = await this.ingressService.getAllEntities(entityType)

    if (entitiesIds?.length) {
      switch (entityType) {
        case 'PERSON': {
          this.logger.debug(`Refreshing ${entitiesIds.length} persons in index`)
          return this.personEventDispatcherService.dispatchPersonsUpdated(entitiesIds)
        }
        case 'COMPANY': {
          this.logger.debug(`Refreshing ${entitiesIds.length} companies in index`)
          return this.companyEventDispatcherService.dispatchCompaniesUpdated(entitiesIds)
        }
        case 'EVENT': {
          this.logger.debug(`Refreshing ${entitiesIds.length} events in index`)
          return this.eventEventDispatcherService.dispatchEventsUpdated(entitiesIds)
        }
        case 'PROPERTY': {
          this.logger.debug(`Refreshing ${entitiesIds.length} properties in index`)
          return this.propertyEventDispatcherService.dispatchPropertiesUpdated(entitiesIds)
        }
        case 'PROCEEDING': {
          this.logger.debug(`Refreshing ${entitiesIds.length} proceedings in index`)
          return this.proceedingEventDispatcherService.dispatchProceedingsUpdated(entitiesIds)
        }
        case 'FILE': {
          this.logger.debug(`Refreshing ${entitiesIds.length} files in index`)
          return this.fileEventDispatcherService.dispatchFilesUpdated(entitiesIds)
        }
      }
    } else this.logger.debug(`No entities of type ${entityType} to refresh`)
  }
}
