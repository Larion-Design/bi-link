import { CacheService } from '@app/service-cache-module'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PropertyCacheService {
  constructor(private readonly cacheService: CacheService) {}
}
