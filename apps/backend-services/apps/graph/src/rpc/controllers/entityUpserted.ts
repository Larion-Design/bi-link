import { GraphServiceMethods } from '@app/rpc/microservices/graph/graphServiceConfig'
import { Controller, Logger } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { EntityInfo, EntityType } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { MICROSERVICES } from '@app/rpc/constants'
import { CompanyDispatcherService } from '../../producers/services/companyDispatcherService'
import { EventDispatcherService } from '../../producers/services/eventDispatcherService'
import { PersonDispatcherService } from '../../producers/services/personDispatcherService'
import { ProceedingDispatcherService } from '../../producers/services/proceedingDispatcherService'
import { PropertyDispatcherService } from '../../producers/services/propertyDispatcherService'
import { ReportDispatcherService } from '../../producers/services/reportDispatcherService'

@Controller()
export class EntityUpserted {
  private readonly logger = new Logger(EntityUpserted.name)

  constructor(
    private readonly personEventDispatcherService: PersonDispatcherService,
    private readonly companyEventDispatcherService: CompanyDispatcherService,
    private readonly propertyEventDispatcherService: PropertyDispatcherService,
    private readonly eventDispatcherService: EventDispatcherService,
    private readonly reportDispatcherService: ReportDispatcherService,
    private readonly proceedingDispatcherService: ProceedingDispatcherService,
    private readonly ingressService: IngressService,
  ) {}

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
