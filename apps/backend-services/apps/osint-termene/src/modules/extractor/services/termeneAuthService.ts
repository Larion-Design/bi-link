import { BrowserPageService } from '@app/browser-module/browserPageService'
import { BrowserService } from '@app/browser-module/browserService'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Page } from 'puppeteer-core'

@Injectable()
export class TermeneAuthService {
  private readonly logger = new Logger(TermeneAuthService.name)
  private readonly loginPage = 'https://termene.ro/autentificare'
  private readonly email: string
  private readonly password: string

  constructor(
    private readonly browserService: BrowserService,
    private readonly browserPageService: BrowserPageService,
    configService: ConfigService,
  ) {
    this.email = configService.getOrThrow<string>('SCRAPER_TERMENE_EMAIL')
    this.password = configService.getOrThrow<string>('SCRAPER_TERMENE_PASSWORD')
  }

  async authenticate(page: Page) {
    await page.goto(this.loginPage)
    await page.waitForNetworkIdle()

    if (this.isUserAuthenticated(page)) {
      this.logger.debug('User is already logged into termene.ro.')
      return true
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

    const isAuthenticated = this.isUserAuthenticated(page)

    if (isAuthenticated) {
      this.logger.debug('The user was authenticated')
    } else {
      this.logger.debug('The user was not authenticated')
    }
    return isAuthenticated
  }

  private isUserAuthenticated = (page: Page) => page.url() !== this.loginPage
}
