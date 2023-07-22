import { BrowserPageService } from '@app/browser-module/browserPageService'
import { BrowserService } from '@app/browser-module/browserService'
import { CacheService } from '@app/cache'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Page } from 'puppeteer-core'

@Injectable()
export class TermeneAuthService {
  private readonly logger = new Logger(TermeneAuthService.name)
  private readonly loginPage = 'https://termene.ro/autentificare'
  private readonly profilePage = 'https://termene.ro/profil'
  private readonly email: string
  private readonly password: string

  constructor(
    private readonly browserService: BrowserService,
    private readonly browserPageService: BrowserPageService,
    private readonly cacheService: CacheService,
    configService: ConfigService,
  ) {
    this.email = configService.getOrThrow<string>('SCRAPER_TERMENE_EMAIL')
    this.password = configService.getOrThrow<string>('SCRAPER_TERMENE_PASSWORD')

    // const t0 = performance.now()
    void this.browserService.execBrowserSession(async (context) =>
      this.authenticatedSession(context, async (page) => {
        await page.goto(this.profilePage)
        await page.waitForNetworkIdle()
        console.debug(page.url())
      }),
    )
  }

  async authenticatedSession<T>(context, handler: (page: Page) => Promise<T>) {
    const authenticated = await this.browserService.handlePage(context, async (page) => {
      if (!(await this.isUserAuthenticated(page))) {
        return this.authenticate(page)
      }
      return true
    })

    if (authenticated) {
      return this.browserService.handlePage(context, handler)
    }
  }

  async isUserAuthenticated(page: Page) {
    console.debug('restoring cookies')
    await this.restoreAuthSession(page)
    await page.goto(this.loginPage)
    await page.waitForNetworkIdle()
    return page.url() === this.profilePage
  }

  async authenticate(page: Page) {
    if (page.url() !== this.loginPage) {
      await page.goto(this.loginPage)
    }

    this.logger.debug('Will begin user authentication into termene.ro')
    await page.setRequestInterception(true)

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    page.on('request', (request) => {
      if (request.method().toUpperCase() === 'POST' && request.url().includes('login.php')) {
        const urlParams = new URLSearchParams({
          emailOrPhone: this.email,
          password: this.password,
        })

        return request.continue({ postData: urlParams.toString() })
      }
      return request.continue()
    })

    await page.click('#loginBtn')
    await page.waitForNetworkIdle()

    const isAuthenticated = page.url() === this.profilePage

    if (isAuthenticated) {
      this.logger.debug('The user was authenticated')
      await this.saveAuthSession(page)
    } else {
      this.logger.debug('The user was not authenticated')
    }
    return isAuthenticated
  }

  private async saveAuthSession(page: Page) {
    console.debug('saving cookies')

    const cookies = await page.cookies()

    if (cookies.length) {
      await this.cacheService.set('osint.termene.authSession', JSON.stringify(cookies), 600)
    }
  }

  private async restoreAuthSession(page: Page) {
    const cookiesString = await this.cacheService.get('osint.termene.authSession')

    if (cookiesString) {
      await page.setCookie(JSON.parse(cookiesString))
    }
  }
}
