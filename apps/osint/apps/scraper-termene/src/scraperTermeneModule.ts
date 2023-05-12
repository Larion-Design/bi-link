import { BrowserModule } from '@app/browser-module'
import { Module } from '@nestjs/common'
import { CompanyBasicDatasetScraperService } from './services/companyBasicDatasetScraperService'
import { CompanyDatasetScraperService } from './services/companyDatasetScraperService'
import { TermeneScraperService } from './services/termeneScraperService'

@Module({
  imports: [BrowserModule],
  providers: [
    TermeneScraperService,
    CompanyBasicDatasetScraperService,
    CompanyDatasetScraperService,
  ],
  controllers: [],
})
export class ScraperTermeneModule {}
