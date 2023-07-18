import { Module } from '@nestjs/common'
import { BrowserModule } from '@app/browser-module'
import {
  TermeneAuthService,
  AssociateDatasetScraperService,
  CompanyBasicDatasetScraperService,
  CompanyDatasetScraperService,
} from './services'

@Module({
  imports: [BrowserModule],
  providers: [
    TermeneAuthService,
    CompanyBasicDatasetScraperService,
    CompanyDatasetScraperService,
    AssociateDatasetScraperService,
  ],
  exports: [
    TermeneAuthService,
    CompanyBasicDatasetScraperService,
    CompanyDatasetScraperService,
    AssociateDatasetScraperService,
  ],
})
export class ExtractorModule {}
