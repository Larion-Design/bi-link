import { GraphServiceMethods } from '@app/rpc/microservices/graph/graphServiceConfig'
import { Controller, Logger } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'
import { EntityInfo, EntityType } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { MICROSERVICES } from '@app/rpc/constants'
import { CompanyDispatcherService } from '../../scheduler/companies/companyDispatcherService'
import { EventDispatcherService } from '../../scheduler/events/eventDispatcherService'
import { PersonDispatcherService } from '../../scheduler/persons/personDispatcherService'
import { ProceedingDispatcherService } from '../../scheduler/proceedings/proceedingDispatcherService'
import { PropertyDispatcherService } from '../../scheduler/properties/propertyDispatcherService'
import { ReportDispatcherService } from '../../scheduler/reports/reportDispatcherService'

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
        return this.personEventDispatcherService.dispatchEntityUpdated(entityId)
      }
      case 'COMPANY': {
        return this.companyEventDispatcherService.dispatchEntityUpdated(entityId)
      }
      case 'EVENT': {
        return this.eventDispatcherService.dispatchEntityUpdated(entityId)
      }
      case 'PROPERTY': {
        return this.propertyEventDispatcherService.dispatchEntityUpdated(entityId)
      }
      case 'REPORT': {
        return this.reportDispatcherService.dispatchEntityUpdated(entityId)
      }
      case 'PROCEEDING': {
        return this.proceedingDispatcherService.dispatchEntityUpdated(entityId)
      }
    }
  }
}
