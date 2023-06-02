import { Injectable } from '@nestjs/common'
import { RedisService } from '@liaoliaots/nestjs-redis'

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  get = async (key: string) => this.redisService.getClient().get(key)

  set = async (key: string, value: string, ttl = 0) =>
    this.redisService.getClient().set(key, value, 'EX', ttl)

  delete = async (key: string) => this.redisService.getClient().del(key)
}
