import { MICROSERVICES } from '@app/rpc'
import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { IngressServiceMethods } from '@app/rpc/microservices/ingress'
import { ProceedingCacheService } from '../../cache'
import { ProceedingsService } from '../../entities/proceeding/services/proceedingsService'

type Params = Parameters<IngressServiceMethods['findProceedingId']>[0]

@Controller()
export class FindProceedingId {
  private readonly logger = new Logger(FindProceedingId.name)

  constructor(
    private readonly proceedingsService: ProceedingsService,
    private readonly proceedingCacheService: ProceedingCacheService,
  ) {}

  @MessagePattern(MICROSERVICES.INGRESS.findProceedingId)
  async findProceedingId(@Payload() fileNumber: Params) {
    const cachedProceedingId = await this.proceedingCacheService.getCachedProceedingId(fileNumber)

    if (cachedProceedingId) {
      const proceedingDocument = await this.proceedingsService.findByFileNumber(fileNumber)

      if (proceedingDocument) {
        await this.proceedingCacheService.cacheProceedingId(proceedingDocument)
        return String(proceedingDocument?._id)
      }
    }
  }
}
