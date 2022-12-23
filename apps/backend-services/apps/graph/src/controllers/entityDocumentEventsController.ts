import { Controller, Logger } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { EntityInfo, MICROSERVICES } from '@app/pub/constants'
import { PersonGraphService } from '../services/personGraphService'
import { CompanyGraphService } from '../services/companyGraphService'
import { IncidentGraphService } from '../services/incidentGraphService'
import { PropertyGraphService } from '../services/propertyGraphService'

@Controller()
export class EntityDocumentEventsController {
  private readonly logger = new Logger(EntityDocumentEventsController.name)

  constructor(
    private readonly personGraphService: PersonGraphService,
    private readonly companyGraphService: CompanyGraphService,
    private readonly incidentGraphService: IncidentGraphService,
    private readonly propertyGraphService: PropertyGraphService,
  ) {}

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entityCreated)
  async entityCreated(@Payload() entityInfo: EntityInfo) {
    this.logger.debug(`Adding ${entityInfo.entityType}:${entityInfo.entityId} to graph`)
    return this.upsertEntityNode(entityInfo)
  }

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entityModified)
  async entityModified(@Payload() entityInfo: EntityInfo) {
    this.logger.debug(`Updating ${entityInfo.entityType}:${entityInfo.entityId} in graph`)
    return this.upsertEntityNode(entityInfo)
  }

  private readonly upsertEntityNode = async ({ entityId, entityType }: EntityInfo) => {
    switch (entityType) {
      case 'PERSON': {
        return this.personGraphService.upsertPersonNode(entityId)
      }
      case 'COMPANY': {
        return this.companyGraphService.upsertCompanyNode(entityId)
      }
      case 'INCIDENT': {
        return this.incidentGraphService.upsertIncidentNode(entityId)
      }
      case 'PROPERTY': {
        return this.propertyGraphService.upsertPropertyNode(entityId)
      }
    }
  }
}
