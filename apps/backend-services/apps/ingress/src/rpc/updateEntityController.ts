import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { getUnixTime } from 'date-fns'
import {
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
export class UpdateEntityController {
  private readonly logger = new Logger(UpdateEntityController.name)

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

  @MessagePattern(MICROSERVICES.INGRESS.updateEntity)
  async updateEntity(
    @Payload()
    { entityInfo, entityData, source }: Parameters<IngressServiceMethods['updateEntity']>[0],
  ) {
    const { entityId, entityType } = entityInfo
    let updated: boolean | undefined = false

    switch (entityType) {
      case 'PERSON': {
        const personInfo = personAPIInputSchema.parse(entityData)

        if (personInfo) {
          updated = await this.personsAPIService.update(entityId, personInfo)
        }
        break
      }
      case 'COMPANY': {
        const companyInfo = companyAPIInputSchema.parse(entityData)

        if (companyInfo) {
          updated = await this.companyAPIService.update(entityId, companyInfo)
        }
        break
      }
      case 'PROPERTY': {
        const propertyInfo = propertyAPIInputSchema.parse(entityData)

        if (propertyInfo) {
          updated = await this.propertyAPIService.updateProperty(entityId, propertyInfo)
        }
        break
      }
      case 'EVENT': {
        const eventInfo = eventAPIInputSchema.parse(entityData)

        if (eventInfo) {
          updated = await this.eventAPIService.update(entityId, eventInfo)
        }
        break
      }
      case 'PROCEEDING': {
        const proceedingInfo = proceedingAPIInputSchema.parse(entityData)

        if (proceedingInfo) {
          updated = await this.proceedingAPIService.update(entityId, proceedingInfo)
        }
        break
      }
      case 'FILE': {
        const fileInfo = fileInputSchema.parse(entityData)

        if (fileInfo) {
          const fileDocument = await this.fileAPIService.getUploadedFileModel(fileInfo)
          updated = !!fileDocument
        }
        break
      }
      case 'REPORT': {
        const reportInfo = reportAPIInputSchema.parse(entityData)

        if (reportInfo) {
          updated = await this.reportAPIService.updateReport(entityId, reportInfo)
        }
        break
      }
    }

    if (updated) {
      this.globalEventsService.dispatchEntityUpdated(entityInfo)
      this.activityHistoryService.recordAction({
        timestamp: getUnixTime(new Date()),
        eventType: 'ENTITY_UPDATED',
        author: source,
        targetEntityInfo: entityInfo,
      })
    }
  }
}
