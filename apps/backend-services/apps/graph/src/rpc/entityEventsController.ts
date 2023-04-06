import { GraphServiceMethods } from '@app/rpc/microservices/graph/graphServiceConfig'
import { Controller, Logger } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { EntityInfo, EntityType } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { MICROSERVICES } from '@app/rpc/constants'
import { GraphService } from '../graph'
import { CompanyDispatcherService } from '../producers/services/companyDispatcherService'
import { EventDispatcherService } from '../producers/services/eventDispatcherService'
import { PersonDispatcherService } from '../producers/services/personDispatcherService'
import { ProceedingDispatcherService } from '../producers/services/proceedingDispatcherService'
import { PropertyDispatcherService } from '../producers/services/propertyDispatcherService'
import { ReportDispatcherService } from '../producers/services/reportDispatcherService'

@Controller()
export class EntityEventsController {
  private readonly logger = new Logger(EntityEventsController.name)

  constructor(
    private readonly personEventDispatcherService: PersonDispatcherService,
    private readonly companyEventDispatcherService: CompanyDispatcherService,
    private readonly propertyEventDispatcherService: PropertyDispatcherService,
    private readonly eventDispatcherService: EventDispatcherService,
    private readonly reportDispatcherService: ReportDispatcherService,
    private readonly proceedingDispatcherService: ProceedingDispatcherService,
    private readonly ingressService: IngressService,
    private readonly graphService: GraphService,
  ) {}

  @MessagePattern(MICROSERVICES.GRAPH.getEntityRelationships)
  async getEntityRelationships(
    @Payload() { entityId, depth }: Parameters<GraphServiceMethods['getEntityRelationships']>[0],
  ) {
    return this.graphService.getEntitiesGraph(entityId, depth)
  }

  @EventPattern(MICROSERVICES.GLOBAL.entityCreated)
  async entityCreated(@Payload() entityInfo: EntityInfo) {
    this.logger.debug(`Adding ${entityInfo.entityType}:${entityInfo.entityId} to graph`)
    return this.scheduleGraphUpdate(entityInfo)
  }

  @EventPattern(MICROSERVICES.GLOBAL.entityModified)
  async entityModified(@Payload() entityInfo: EntityInfo) {
    this.logger.debug(`Updating ${entityInfo.entityType}:${entityInfo.entityId} in graph`)
    return this.scheduleGraphUpdate(entityInfo)
  }

  @EventPattern(MICROSERVICES.GLOBAL.entitiesRefreshed)
  async entitiesRefresh(@Payload() entityType: EntityType) {
    return this.refreshAllGraphEntitiesByType(entityType)
  }

  @EventPattern(MICROSERVICES.GRAPH.refreshNodes)
  async graphNodesRefresh(@Payload() entityType: EntityType) {
    return this.refreshAllGraphEntitiesByType(entityType)
  }

  private readonly refreshAllGraphEntitiesByType = async (entityType: EntityType) => {
    const entitiesIds = await this.ingressService.getAllEntities(entityType)

    if (entitiesIds?.length) {
      switch (entityType) {
        case 'PERSON': {
          this.logger.debug(`Refreshing ${entitiesIds.length} persons in graph`)
          return this.personEventDispatcherService.dispatchPersonsUpdated(entitiesIds)
        }
        case 'COMPANY': {
          this.logger.debug(`Refreshing ${entitiesIds.length} companies in graph`)
          return this.companyEventDispatcherService.dispatchCompaniesUpdated(entitiesIds)
        }
        case 'EVENT': {
          this.logger.debug(`Refreshing ${entitiesIds.length} events in graph`)
          return this.eventDispatcherService.dispatchEventsUpdated(entitiesIds)
        }
        case 'PROPERTY': {
          this.logger.debug(`Refreshing ${entitiesIds.length} properties in graph`)
          return this.propertyEventDispatcherService.dispatchPropertiesUpdated(entitiesIds)
        }
        case 'REPORT': {
          this.logger.debug(`Refreshing ${entitiesIds.length} reports in graph`)
          return this.reportDispatcherService.dispatchReportsUpdated(entitiesIds)
        }
        case 'PROCEEDING': {
          this.logger.debug(`Refreshing ${entitiesIds.length} proceedings in graph`)
          return this.proceedingDispatcherService.dispatchProceedingsUpdated(entitiesIds)
        }
      }
    } else this.logger.debug(`No entities of type ${entityType} to refresh in graph`)
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
      case 'REPORT': {
        return this.reportDispatcherService.dispatchReportUpdated(entityId)
      }
      case 'PROCEEDING': {
        return this.proceedingDispatcherService.dispatchProceedingUpdated(entityId)
      }
    }
  }
}
