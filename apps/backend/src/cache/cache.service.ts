import { Cache } from 'cache-manager'
import { RedisStore } from 'cache-manager-ioredis-yet'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable, Logger } from '@nestjs/common'

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name)

  constructor(@Inject(CACHE_MANAGER) private redis: Cache<RedisStore>) {}

  private get store() {
    return this.redis.store.client
  }

  async get<Shape>(key: string) {
    const data = await this.redis.get<string>(key)
    return data ? (JSON.parse(data) as Shape) : null
  }

  async getMultiple(keys: string[]) {
    const map: Record<string, string> = {}
    const data = await this.store.mget(...keys)

    data.forEach((value, index) => {
      if (value?.length) {
        map[keys[index] as string] = JSON.parse(value)
      }
    })
    return map
  }

  async setMultiple(data: Record<string, string>, ttl = 0) {
    if (ttl) {
      const transaction = this.store.multi()
      Object.entries(data).forEach(([key, value]) => transaction.setex(key, value, ttl))
      return transaction.exec()
    }
    return this.store.mset(data)
  }

  async set(key: string, value: unknown, ttl = 0) {
    await this.store.setex(key, ttl, JSON.stringify(value))
  }

  delete = async (keys: string[]) => this.store.del(keys)

  getHashKey = async (rootKey: string, hashKey: string) => this.store.hget(rootKey, hashKey)

  setHashKeys = async (rootKey: string, data: Record<string, string>) =>
    this.store.hset(rootKey, data)

  deleteHashKeys = async (rootKey: string, hashKeys: string[]) =>
    this.store.hdel(rootKey, ...hashKeys)
}
