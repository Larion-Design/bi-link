import { CacheService } from '@app/service-cache-module'
import { Injectable } from '@nestjs/common'
import { Proceeding } from 'defs'

@Injectable()
export class ProceedingCacheService {
  private readonly key = 'cachedProceedings'

  constructor(private readonly cacheService: CacheService) {}

  getCachedProceedingId = async (fileNumber: string) =>
    this.cacheService.getHashKey(this.key, fileNumber)

  cacheProceedingId = async (proceedingId: string, proceedingInfo: Proceeding) => {
    const {
      fileNumber: { value: fileNumber },
    } = proceedingInfo

    if (fileNumber?.length) {
      return this.cacheService.setHashKeys(this.key, { [fileNumber]: proceedingId })
    }
  }
}
