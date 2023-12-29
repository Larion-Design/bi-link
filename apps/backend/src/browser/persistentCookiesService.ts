import { CacheService } from '@modules/cache'
import { Injectable } from '@nestjs/common'
import { Protocol } from 'puppeteer-core'

type CookiesList = Protocol.Network.Cookie[]

@Injectable()
export class PersistentCookiesService {
  private readonly persistentCookiesMap = new Map<string, CookiesList>()

  constructor(private readonly cacheService: CacheService) {}

  async persistCookies(key: string, cookies: CookiesList, duration = 1200) {
    this.persistentCookiesMap.set(key, cookies)
    return this.cacheService.set(key, JSON.stringify(cookies), duration)
  }

  async retrieveCookies(key: string) {
    const cookies = this.persistentCookiesMap.get(key)

    if (cookies?.length) {
      return cookies
    }

    const cookiesString = await this.cacheService.get<CookiesList>(key)

    if (cookiesString) {
      const cookies: CookiesList = Array.from(cookiesString)

      if (cookies?.length) {
        this.persistentCookiesMap.set(key, cookies)
        return cookies
      }
    }
  }
}
