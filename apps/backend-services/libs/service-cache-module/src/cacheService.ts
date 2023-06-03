import { Injectable } from '@nestjs/common'
import { RedisService } from '@liaoliaots/nestjs-redis'

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  get = async <T = string>(key: string) =>
    this.redisService.getClient().get(key) as Promise<T | null>

  set = async (key: string, value: string, ttl = 0) =>
    this.redisService.getClient().set(key, value, 'EX', ttl)

  delete = async (key: string) => this.redisService.getClient().del(key)
}
