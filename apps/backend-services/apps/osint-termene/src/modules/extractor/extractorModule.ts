import { BrowserModule } from '@app/browser-module'
import { Module } from '@nestjs/common'
import { AssociateDatasetScraperService } from './services/associateDatasetScraperService'
import { CompanyBasicDatasetScraperService } from './services/companyBasicDatasetScraperService'
import { CompanyDatasetScraperService } from './services/companyDatasetScraperService'
import { TermeneAuthService } from './services/termeneAuthService'

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
