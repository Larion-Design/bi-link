import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { IngressService } from '@app/rpc/microservices/ingress'
import { MICROSERVICES } from '@app/rpc/constants'
import { ActivityEventInput, EntityInfo, EntityType } from 'defs'
import { HistoryIndexerService } from '../../indexer/services'
import { CompanyEventDispatcherService } from '../../scheduler/companies/companyEventDispatcherService'
import { PersonEventDispatcherService } from '../../scheduler/persons/personEventDispatcherService'
import { EventDispatcherService } from '../../scheduler/events/eventDispatcherService'
import { ProceedingEventDispatcherService } from '../../scheduler/proceedings/proceedingEventDispatcherService'
import { FileEventDispatcherService } from '../../scheduler/files/fileEventDispatcherService'
import { PropertyEventDispatcherService } from '../../scheduler/properties/propertyEventDispatcherService'

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
    private readonly proceedingEventDispatcherService: ProceedingEventDispatcherService,
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
        return this.personEventDispatcherService.dispatchEntityCreated(entityId)
      }
      case 'COMPANY': {
        return this.companyEventDispatcherService.dispatchEntityCreated(entityId)
      }
      case 'PROPERTY': {
        return this.propertyEventDispatcherService.dispatchEntityCreated(entityId)
      }
      case 'EVENT': {
        return this.eventEventDispatcherService.dispatchEntityCreated(entityId)
      }
      case 'FILE': {
        return this.fileEventDispatcherService.dispatchFileCreated(entityId)
      }
      case 'PROCEEDING': {
        return this.proceedingEventDispatcherService.dispatchEntityCreated(entityId)
      }
    }
  }

  @EventPattern(MICROSERVICES.INDEXER.indexEntity)
  async indexEntity(@Payload() entityInfo: EntityInfo) {
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
    switch (entityType) {
      case 'PERSON': {
        return this.personEventDispatcherService.dispatchEntityUpdated(entityId)
      }
      case 'COMPANY': {
        return this.companyEventDispatcherService.dispatchEntityUpdated(entityId)
      }
      case 'PROPERTY': {
        return this.propertyEventDispatcherService.dispatchEntityUpdated(entityId)
      }
      case 'EVENT': {
        return this.eventEventDispatcherService.dispatchEntityUpdated(entityId)
      }
      case 'FILE': {
        return this.fileEventDispatcherService.dispatchFileUpdated(entityId)
      }
      case 'PROCEEDING': {
        return this.proceedingEventDispatcherService.dispatchEntityUpdated(entityId)
      }
    }
  }

  private refreshAllIndexEntitiesByType = async (entityType: EntityType) => {
    const entitiesIds = await this.ingressService.getAllEntities(entityType)

    if (entitiesIds?.length) {
      switch (entityType) {
        case 'PERSON': {
          this.logger.debug(`Refreshing ${entitiesIds.length} persons in index`)
          return this.personEventDispatcherService.dispatchEntitiesUpdated(entitiesIds)
        }
        case 'COMPANY': {
          this.logger.debug(`Refreshing ${entitiesIds.length} companies in index`)
          return this.companyEventDispatcherService.dispatchEntitiesUpdated(entitiesIds)
        }
        case 'EVENT': {
          this.logger.debug(`Refreshing ${entitiesIds.length} events in index`)
          return this.eventEventDispatcherService.dispatchEntitiesUpdated(entitiesIds)
        }
        case 'PROPERTY': {
          this.logger.debug(`Refreshing ${entitiesIds.length} properties in index`)
          return this.propertyEventDispatcherService.dispatchEntitiesUpdated(entitiesIds)
        }
        case 'PROCEEDING': {
          this.logger.debug(`Refreshing ${entitiesIds.length} proceedings in index`)
          return this.proceedingEventDispatcherService.dispatchEntitiesUpdated(entitiesIds)
        }
        case 'FILE': {
          this.logger.debug(`Refreshing ${entitiesIds.length} files in index`)
          return this.fileEventDispatcherService.dispatchFilesUpdated(entitiesIds)
        }
      }
    } else this.logger.debug(`No entities of type ${entityType} to refresh`)
  }
}
