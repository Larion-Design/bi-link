import { LoaderModule } from '@app/loader-module'
import { Module } from '@nestjs/common'
import { BrowserModule } from '@app/browser-module'
import { TransformerModule } from '../transformer/transformerModule'
import {
  TermeneAuthService,
  AssociateDatasetScraperService,
  CompanyBasicDatasetScraperService,
  CompanyDatasetScraperService,
} from './services'

@Module({
  imports: [BrowserModule, TransformerModule, LoaderModule],
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
