import { BrowserService } from '@app/browser-module'
import { MICROSERVICES } from '@app/rpc'
import { OsintTermeneServiceConfig } from '@app/rpc/microservices/osint/termene'
import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { AssociateScraperService } from '../../extractor'

type Params = Parameters<OsintTermeneServiceConfig['searchPersons']>[0]
type Result = ReturnType<OsintTermeneServiceConfig['searchPersons']> | undefined

@Controller()
export class SearchPersonsByName {
  constructor(
    private readonly associateScraperService: AssociateScraperService,
    private readonly browserService: BrowserService,
  ) {}

  @MessagePattern(MICROSERVICES.OSINT.TERMENE.searchPersons)
  async searchCompanyByCUI(@Payload() cui: Params): Promise<Result> {
    return this.browserService.execBrowserSession(async (browser) =>
      this.associateScraperService.searchAssociatesByName(browser, cui),
    )
  }
}
