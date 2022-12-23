import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { EntityInfo, MICROSERVICES } from '@app/pub/constants'
import { CompanyEventDispatcherService } from '../producers/services/companyEventDispatcherService'
import { PersonEventDispatcherService } from '../producers/services/personEventDispatcherService'
import { IncidentEventDispatcherService } from '../producers/services/incidentEventDispatcherService'
import { RelatedEntitiesSearchService } from '../producers/services/relatedEntitiesSearchService'
import { FileEventDispatcherService } from '../producers/services/fileEventDispatcherService'
import { PropertyEventDispatcherService } from '../producers/services/propertyEventDispatcherService'

@Controller()
export class EntityEventsController {
  constructor(
    private readonly companyEventDispatcherService: CompanyEventDispatcherService,
    private readonly personEventDispatcherService: PersonEventDispatcherService,
    private readonly propertyEventDispatcherService: PropertyEventDispatcherService,
    private readonly incidentEventDispatcherService: IncidentEventDispatcherService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
    private readonly relatedEntitiesSearchService: RelatedEntitiesSearchService,
  ) {}

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entityModified)
  async entityModified(@Payload() { entityId, entityType }: EntityInfo) {
    let relatedCompaniesIds: string[]
    let relatedIncidentsIds: string[]
    let relatedPropertiesIds: string[]

    switch (entityType) {
      case 'PERSON': {
        relatedCompaniesIds = await this.relatedEntitiesSearchService.getCompaniesRelatedToPerson(
          entityId,
        )
        relatedPropertiesIds = await this.relatedEntitiesSearchService.getPropertiesRelatedToPerson(
          entityId,
        )
        relatedIncidentsIds = await this.relatedEntitiesSearchService.getIncidentsRelatedToPerson(
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
        relatedIncidentsIds = await this.relatedEntitiesSearchService.getIncidentsRelatedToProperty(
          entityId,
        )
        return this.propertyEventDispatcherService.dispatchPropertyUpdated(entityId)
      }
      case 'INCIDENT': {
        return this.incidentEventDispatcherService.dispatchIncidentUpdated(entityId)
      }
      case 'FILE': {
        return this.fileEventDispatcherService.dispatchFileCreated({ fileId: entityId })
      }
    }

    const dispatchedEvents = []

    if (relatedCompaniesIds?.length) {
      dispatchedEvents.push(
        this.companyEventDispatcherService.dispatchCompaniesUpdated(relatedCompaniesIds),
      )
    }
    if (relatedIncidentsIds?.length) {
      dispatchedEvents.push(
        this.incidentEventDispatcherService.dispatchIncidentsUpdated(relatedIncidentsIds),
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
      case 'INCIDENT': {
        return this.incidentEventDispatcherService.dispatchIncidentCreated(entityId)
      }
      case 'FILE': {
        return this.fileEventDispatcherService.dispatchFileCreated({ fileId: entityId })
      }
    }
  }
}
