import { BrowserPageService } from '@app/browser-module/browserPageService'
import { BrowserService } from '@app/browser-module/browserService'
import { CacheService } from '@app/cache'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BrowserContext, Page, Protocol } from 'puppeteer-core'
import { v4 } from 'uuid'

@Injectable()
export class TermeneAuthService {
  private readonly logger = new Logger(TermeneAuthService.name)
  private readonly loginPage = 'https://termene.ro/autentificare'
  private readonly profilePage = 'https://termene.ro/profil'
  private readonly email: string
  private readonly password: string
  private cookies?: Protocol.Network.Cookie[]

  constructor(
    private readonly browserService: BrowserService,
    private readonly browserPageService: BrowserPageService,
    private readonly cacheService: CacheService,
    configService: ConfigService,
  ) {
    this.email = configService.getOrThrow<string>('SCRAPER_TERMENE_EMAIL')
    this.password = configService.getOrThrow<string>('SCRAPER_TERMENE_PASSWORD')
  }

  async authenticatedPage<T>(handler: (page: Page) => Promise<T>) {
    return this.browserService.execBrowserSession(
      async (context) => {
        const authenticated = await this.browserService.handlePage(context, async (page) => {
          if (!(await this.isUserAuthenticated(page))) {
            return this.authenticate(page)
          }
          return true
        })

        if (authenticated) {
          return this.browserService.handlePage(context, handler)
        }
      },
      {
        private: true,
        sessionId: v4(),
      },
    )
  }

  async authenticatedSession<T>(handler: (context: BrowserContext) => Promise<T>) {
    return this.browserService.execBrowserSession(
      async (context) => {
        const authenticated = await this.browserService.handlePage(context, async (page) => {
          if (!(await this.isUserAuthenticated(page))) {
            return this.authenticate(page)
          }
          return true
        })

        if (authenticated) {
          return handler(context)
        }
      },
      {
        private: true,
        sessionId: v4(),
      },
    )
  }

  private async isUserAuthenticated(page: Page) {
    await this.restoreAuthSession(page)
    await page.goto(this.loginPage)

    const isAuthenticated = page.url() === this.profilePage

    if (isAuthenticated) {
      this.logger.debug('Session is already authenticated')
    }
    return isAuthenticated
  }

  async authenticate(page: Page) {
    if (page.url() !== this.loginPage) {
      await page.goto(this.loginPage, { waitUntil: 'domcontentloaded' })
    }

    this.logger.debug('Will begin user authentication into termene.ro')

    await page.type('#emailOrPhone', this.email)
    await page.type('#password', this.password)

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#loginBtn'),
    ])

    const isAuthenticated = page.url() === this.profilePage

    if (isAuthenticated) {
      this.logger.debug('The user was authenticated')
      await this.saveAuthSession(page)
    } else {
      this.logger.debug(
        `The user was not authenticated, Current page after login attempt is ${page.url()}`,
      )
    }
    return isAuthenticated
  }

  private async saveAuthSession(page: Page) {
    this.logger.debug('Saving session cookies for termene.ro')

    const cookies = await page.cookies()

    if (cookies.length) {
      await this.cacheService.set('osint.termene.authSession', JSON.stringify(cookies), 600)
      this.cookies = cookies
    }
  }

  private async restoreAuthSession(page: Page) {
    console.debug('Restoring session cookies for termene.ro')

    if (!this.cookies) {
      const cookiesString = await this.cacheService.get('osint.termene.authSession')

      if (cookiesString) {
        this.cookies = Array.from<Protocol.Network.Cookie>(JSON.parse(cookiesString))
      }
    }

    if (this.cookies?.length) {
      await page.setCookie(...this.cookies)
    }
  }
}
