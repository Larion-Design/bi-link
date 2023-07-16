import { Injectable } from '@nestjs/common'
import { CacheService } from '@app/cache/cacheService'

@Injectable()
export class PropertyCacheService {
  constructor(private readonly cacheService: CacheService) {}
}
