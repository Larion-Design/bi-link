import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { EntityInfo, MICROSERVICES } from '@app/pub/constants'
import { CompanyEventDispatcherService } from '../producers/services/companyEventDispatcherService'
import { PersonEventDispatcherService } from '../producers/services/personEventDispatcherService'
import { EventDispatcherService } from '../producers/services/eventDispatcherService'
import { RelatedEntitiesSearchService } from '../producers/services/relatedEntitiesSearchService'
import { FileEventDispatcherService } from '../producers/services/fileEventDispatcherService'
import { PropertyEventDispatcherService } from '../producers/services/propertyEventDispatcherService'
import { ReportEventDispatcherService } from '../producers/services/reportEventDispatcherService'

@Controller()
export class EntityEventsController {
  constructor(
    private readonly companyEventDispatcherService: CompanyEventDispatcherService,
    private readonly personEventDispatcherService: PersonEventDispatcherService,
    private readonly propertyEventDispatcherService: PropertyEventDispatcherService,
    private readonly eventEventDispatcherService: EventDispatcherService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
    private readonly reportEventDispatcherService: ReportEventDispatcherService,
    private readonly relatedEntitiesSearchService: RelatedEntitiesSearchService,
  ) {}

  @EventPattern(MICROSERVICES.ENTITY_EVENTS.entityModified)
  async entityModified(@Payload() { entityId, entityType }: EntityInfo) {
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
      case 'INCIDENT': {
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
}
