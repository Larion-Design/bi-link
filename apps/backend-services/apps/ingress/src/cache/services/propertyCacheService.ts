import { Injectable } from '@nestjs/common'
import { CacheService } from './cacheService'

@Injectable()
export class PropertyCacheService {
  constructor(private readonly cacheService: CacheService) {}
}
