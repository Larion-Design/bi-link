import { Injectable } from '@nestjs/common'
import { IngressService } from '@app/rpc/microservices/ingress'
import { ProceedingAPIInput, UpdateSource } from 'defs'

@Injectable()
export class ProceedingLoaderService {
  constructor(private readonly ingressService: IngressService) {}

  findProceeding = async (fileNumber: string) => this.ingressService.findProceedingId(fileNumber)

  createProceeding = async (proceedingAPIInput: ProceedingAPIInput, author: UpdateSource) =>
    this.ingressService.createEntity('PROCEEDING', proceedingAPIInput, author)

  updateProceeding = async (
    entityId: string,
    proceedingAPIInput: ProceedingAPIInput,
    author: UpdateSource,
  ) =>
    this.ingressService.updateEntity(
      { entityId, entityType: 'PROCEEDING' },
      proceedingAPIInput,
      author,
    )
}
