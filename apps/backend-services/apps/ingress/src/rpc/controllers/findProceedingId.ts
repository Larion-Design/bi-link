import { MICROSERVICES } from '@app/rpc'
import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { IngressServiceMethods } from '@app/rpc/microservices/ingress'
import { ProceedingsService } from '../../entities/proceeding/services/proceedingsService'

type Params = Parameters<IngressServiceMethods['findProceedingId']>[0]

@Controller()
export class FindProceedingId {
  private readonly logger = new Logger(FindProceedingId.name)

  constructor(private readonly proceedingsService: ProceedingsService) {}

  @MessagePattern(MICROSERVICES.INGRESS.findProceedingId)
  async findProceedingId(@Payload() fileNumber: Params) {
    return this.proceedingsService.findByFileNumber(fileNumber)
  }
}
