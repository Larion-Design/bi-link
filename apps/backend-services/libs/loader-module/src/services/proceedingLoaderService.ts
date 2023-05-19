import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { IngressService } from '@app/rpc/microservices/ingress'
import { Cache } from 'cache-manager'
import { ProceedingAPIInput, UpdateSource } from 'defs'

@Injectable()
export class ProceedingLoaderService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly ingressService: IngressService,
  ) {}

  findProceeding = async (fileNumber: string) => {
    const cachedProceedingId = await this.cacheManager.get<string>(fileNumber)

    if (!cachedProceedingId) {
      const proceedingId = await this.ingressService.findProceedingId(fileNumber)

      if (proceedingId) {
        await this.cacheManager.set(fileNumber, proceedingId)
      }
      return proceedingId
    }
    return cachedProceedingId
  }

  createProceeding = async (proceedingAPIInput: ProceedingAPIInput, author: UpdateSource) => {
    const proceedingId = await this.ingressService.createEntity(
      'PROCEEDING',
      proceedingAPIInput,
      author,
    )

    if (proceedingId) {
      const { value } = proceedingAPIInput.fileNumber

      if (value.length) {
        await this.cacheManager.set(value, proceedingId, { ttl: 600 })
      }
    }
    return proceedingId
  }
}
