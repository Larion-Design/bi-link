import { IngressServiceMethods } from '@app/rpc/microservices/ingress'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { companyAPIInputSchema, personAPIInputSchema } from 'defs'
import { MICROSERVICES } from '@app/rpc'
import { CompanyAPIService } from '../../entities/company/services/companyAPIService'
import { EventAPIService } from '../../entities/event/services/eventAPIService'
import { PersonAPIService } from '../../entities/person/services/personAPIService'
import { ProceedingAPIService } from '../../entities/proceeding/services/proceedingAPIService'
import { PropertyAPIService } from '../../entities/property/services/propertyAPIService'
import { ReportAPIService } from '../../entities/report/services/reportAPIService'

type Params = Parameters<IngressServiceMethods['createPendingSnapshot']>[0]
type Result = ReturnType<IngressServiceMethods['createPendingSnapshot']> | undefined

@Controller()
export class CreatePendingSnapshot {
  constructor(
    private readonly personAPIService: PersonAPIService,
    private readonly companyAPIService: CompanyAPIService,
    private readonly propertyAPIService: PropertyAPIService,
    private readonly eventAPIService: EventAPIService,
    private readonly proceedingAPIService: ProceedingAPIService,
    private readonly reportAPIService: ReportAPIService,
  ) {}

  @MessagePattern(MICROSERVICES.INGRESS.createPendingSnapshot)
  async createPendingSnapshot(
    @Payload()
    { entityInfo: { entityType, entityId }, entityData, source }: Params,
  ): Promise<Result> {
    switch (entityType) {
      case 'PERSON': {
        const personInfo = personAPIInputSchema.parse(entityData)

        if (personInfo) {
          return this.personAPIService.createPendingSnapshot(entityId, personInfo, source)
        }
        break
      }
      case 'COMPANY': {
        const companyInfo = companyAPIInputSchema.parse(entityData)

        if (companyInfo) {
          return this.companyAPIService.createPendingSnapshot(entityId, companyInfo, source)
        }
        break
      }
      case 'PROPERTY': {
        break
      }
      case 'EVENT': {
        break
      }
      case 'PROCEEDING': {
        break
      }
      case 'REPORT': {
        break
      }
    }
  }
}
