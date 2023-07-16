import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { EntityType } from 'defs'
import { MICROSERVICES } from '@app/rpc'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CompanyDispatcherService } from '../../scheduler/companies/companyDispatcherService'
import { EventDispatcherService } from '../../scheduler/events/eventDispatcherService'
import { PersonDispatcherService } from '../../scheduler/persons/personDispatcherService'
import { ProceedingDispatcherService } from '../../scheduler/proceedings/proceedingDispatcherService'
import { PropertyDispatcherService } from '../../scheduler/properties/propertyDispatcherService'
import { ReportDispatcherService } from '../../scheduler/reports/reportDispatcherService'

@Controller()
export class RefreshEntities {
  private readonly logger = new Logger(RefreshEntities.name)

  constructor(
    private readonly personEventDispatcherService: PersonDispatcherService,
    private readonly companyEventDispatcherService: CompanyDispatcherService,
    private readonly propertyEventDispatcherService: PropertyDispatcherService,
    private readonly eventDispatcherService: EventDispatcherService,
    private readonly reportDispatcherService: ReportDispatcherService,
    private readonly proceedingDispatcherService: ProceedingDispatcherService,
    private readonly ingressService: IngressService,
  ) {}

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
}
