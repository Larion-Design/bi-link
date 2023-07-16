import { Injectable } from '@nestjs/common'
import { Proceeding } from 'defs'
import { CacheService } from '@app/cache/cacheService'

@Injectable()
export class ProceedingCacheService {
  private readonly key = 'cachedProceedings'

  constructor(private readonly cacheService: CacheService) {}

  getCachedProceedingId = async (fileNumber: string) =>
    this.cacheService.getHashKey(this.key, fileNumber)

  cacheProceedingId = async (proceeding: Proceeding) => {
    const {
      fileNumber: { value: fileNumber },
    } = proceeding

    if (fileNumber?.length) {
      return this.cacheService.setHashKeys(this.key, { [fileNumber]: String(proceeding._id) })
    }
  }
}
