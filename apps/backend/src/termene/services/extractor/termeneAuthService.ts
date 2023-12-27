import { BrowserPageService, BrowserService } from '@modules/browser';
import { CacheService } from '@modules/cache';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrowserContext, Page } from 'puppeteer-core';
import { v4 } from 'uuid';

@Injectable()
export class TermeneAuthService {
  private readonly logger = new Logger(TermeneAuthService.name);
  private readonly loginPage = 'https://termene.ro/autentificare';
  private readonly profilePage = 'https://termene.ro/profil';
  private readonly email: string;
  private readonly password: string;

  constructor(
    private readonly browserService: BrowserService,
    private readonly browserPageService: BrowserPageService,
    private readonly cacheService: CacheService,
    configService: ConfigService,
  ) {
    this.email = configService.getOrThrow<string>('SCRAPER_TERMENE_EMAIL');
    this.password = configService.getOrThrow<string>(
      'SCRAPER_TERMENE_PASSWORD',
    );
  }

  async authenticatedPage<T>(handler: (page: Page) => Promise<T>) {
    return this.browserService.execBrowserSession(
      async (context) =>
        this.browserService.handlePage(
          context,
          async (page) => {
            await page.setJavaScriptEnabled(false);

            if (
              (await this.isUserAuthenticated(page)) ||
              (await this.authenticate(page))
            ) {
              await page.setJavaScriptEnabled(true);
              return handler(page);
            }
          },
          {
            enableCache: true,
            persistentCookiesKey: 'osint.termene.authSession',
          },
        ),
      {
        private: true,
        sessionId: v4(),
      },
    );
  }

  async authenticatedSession<T>(
    handler: (context: BrowserContext) => Promise<T>,
  ) {
    return this.browserService.execBrowserSession(
      async (context) => {
        const authenticated = await this.browserService.handlePage(
          context,
          async (page) => {
            if (!(await this.isUserAuthenticated(page))) {
              return this.authenticate(page);
            }
            return true;
          },
          {
            enableCache: true,
            disableJavascript: true,
            persistentCookiesKey: 'osint.termene.authSession',
          },
        );

        if (authenticated) {
          return handler(context);
        }
      },
      {
        private: true,
        sessionId: v4(),
      },
    );
  }

  private async isUserAuthenticated(page: Page) {
    await page.goto(this.loginPage);

    const isAuthenticated = page.url() === this.profilePage;

    if (isAuthenticated) {
      this.logger.debug('Session is already authenticated');
    }
    return isAuthenticated;
  }

  async authenticate(page: Page) {
    if (page.url() !== this.loginPage) {
      await page.goto(this.loginPage, { waitUntil: 'domcontentloaded' });
    }

    this.logger.debug('Will begin user authentication into termene.ro');

    await page.type('#emailOrPhone', this.email);
    await page.type('#password', this.password);

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('#loginBtn'),
    ]);

    const isAuthenticated = page.url() === this.profilePage;

    if (isAuthenticated) {
      this.logger.debug('The user was authenticated');
    } else {
      this.logger.debug(
        `The user was not authenticated, Current page after login attempt is ${page.url()}`,
      );
    }
    return isAuthenticated;
  }
}
