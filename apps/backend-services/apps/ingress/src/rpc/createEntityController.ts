import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { getUnixTime } from 'date-fns'
import {
  EntityInfo,
  companyAPIInputSchema,
  eventAPIInputSchema,
  fileInputSchema,
  personAPIInputSchema,
  proceedingAPIInputSchema,
  propertyAPIInputSchema,
  reportAPIInputSchema,
} from 'defs'
import { MICROSERVICES } from '@app/rpc/constants'
import { ActivityHistoryService } from '@app/rpc/microservices/activityHistory/activityHistoryService'
import { GlobalEventsService } from '@app/rpc/microservices/globalEvents/globalEventsService'
import { IngressServiceMethods } from '@app/rpc/microservices/ingress'
import { CompanyAPIService } from '../entities/company/services/companyAPIService'
import { EventAPIService } from '../entities/event/services/eventAPIService'
import { FileAPIService } from '../entities/file/services/fileAPIService'
import { PersonAPIService } from '../entities/person/services/personAPIService'
import { ProceedingAPIService } from '../entities/proceeding/services/proceedingAPIService'
import { PropertyAPIService } from '../entities/property/services/propertyAPIService'
import { ReportAPIService } from '../entities/report/services/reportAPIService'

@Controller()
export class CreateEntityController {
  private readonly logger = new Logger(CreateEntityController.name)

  constructor(
    private readonly personsAPIService: PersonAPIService,
    private readonly companyAPIService: CompanyAPIService,
    private readonly fileAPIService: FileAPIService,
    private readonly propertyAPIService: PropertyAPIService,
    private readonly eventAPIService: EventAPIService,
    private readonly proceedingAPIService: ProceedingAPIService,
    private readonly reportAPIService: ReportAPIService,
    private readonly activityHistoryService: ActivityHistoryService,
    private readonly globalEventsService: GlobalEventsService,
  ) {}

  @MessagePattern(MICROSERVICES.INGRESS.createEntity)
  async createEntity(
    @Payload()
    { entityType, entityData, source }: Parameters<IngressServiceMethods['createEntity']>[0],
  ) {
    let entityId: string | undefined

    switch (entityType) {
      case 'PERSON': {
        const personInfo = personAPIInputSchema.parse(entityData)

        if (personInfo) {
          entityId = await this.personsAPIService.create(personInfo)
        }
        break
      }
      case 'COMPANY': {
        const companyInfo = companyAPIInputSchema.parse(entityData)

        if (companyInfo) {
          entityId = await this.companyAPIService.create(companyInfo)
        }
        break
      }
      case 'PROPERTY': {
        const propertyInfo = propertyAPIInputSchema.parse(entityData)

        if (propertyInfo) {
          entityId = await this.propertyAPIService.createProperty(propertyInfo)
        }
        break
      }
      case 'EVENT': {
        const eventInfo = eventAPIInputSchema.parse(entityData)

        if (eventInfo) {
          entityId = await this.eventAPIService.create(eventInfo)
        }
        break
      }
      case 'PROCEEDING': {
        const proceedingInfo = proceedingAPIInputSchema.parse(entityData)

        if (proceedingInfo) {
          entityId = await this.proceedingAPIService.create(proceedingInfo)
        }
        break
      }
      case 'FILE': {
        const fileInfo = fileInputSchema.parse(entityData)

        if (fileInfo) {
          const fileDocument = await this.fileAPIService.getUploadedFileModel(fileInfo)

          if (fileDocument) {
            entityId = fileDocument._id
          }
        }
        break
      }
      case 'REPORT': {
        const reportInfo = reportAPIInputSchema.parse(entityData)

        if (reportInfo) {
          entityId = await this.reportAPIService.createReport(reportInfo)
        }
        break
      }
    }

    if (entityId) {
      const entityInfo: EntityInfo = { entityId, entityType }

      this.globalEventsService.dispatchEntityCreated(entityInfo)
      this.activityHistoryService.recordAction({
        timestamp: getUnixTime(new Date()),
        eventType: 'ENTITY_CREATED',
        author: source,
        targetEntityInfo: entityInfo,
      })
    }
  }
}
