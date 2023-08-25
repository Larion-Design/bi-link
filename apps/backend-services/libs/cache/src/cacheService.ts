import { InjectRedis, Redis } from '@nestjs-modules/ioredis'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name)

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get(key: string) {
    try {
      return this.redis.get(key)
    } catch (e) {
      this.logger.error(e)
    }
  }

  async getMultiple(keys: string[]) {
    const map: Record<string, string> = {}
    const data = await this.redis.mget(keys)

    data.forEach((value, index) => {
      if (value?.length) {
        map[keys[index] as string] = value
      }
    })
    return map
  }

  async setMultiple(data: Record<string, string>, ttl = 0) {
    if (ttl) {
      const transaction = this.redis.multi()
      Object.entries(data).forEach(([key, value]) => transaction.setex(key, value, ttl))
      return transaction.exec()
    }
    return this.redis.mset(data)
  }

  async set(key: string, value: string, ttl = 0) {
    try {
      return this.redis.setex(key, ttl, value)
    } catch (e) {
      this.logger.error(e)
    }
  }

  delete = async (keys: string[]) => this.redis.del(keys)

  getHashKey = async (rootKey: string, hashKey: string) => this.redis.hget(rootKey, hashKey)

  setHashKeys = async (rootKey: string, data: Record<string, string>) =>
    this.redis.hset(rootKey, data)

  deleteHashKeys = async (rootKey: string, hashKeys: string[]) =>
    this.redis.hdel(rootKey, ...hashKeys)
}
