import { BrowserService } from '@app/browser-module'
import { Injectable } from '@nestjs/common'
import { AssociateDatasetScraperService } from './associateDatasetScraperService'

@Injectable()
export class PersonScraperService {
  constructor(
    private readonly associateDatasetScraperService: AssociateDatasetScraperService,
    private readonly browserService: BrowserService,
  ) {}

  async getPersonCompanies(personUrl: string) {
    return this.browserService.execBrowserSession(async (browser) =>
      this.associateDatasetScraperService.getCompaniesByAssociateUrl(browser, personUrl),
    )
  }
}
