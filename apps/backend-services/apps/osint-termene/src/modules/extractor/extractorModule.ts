import { CacheModule } from '@app/cache'
import { Module } from '@nestjs/common'
import { BrowserModule } from '@app/browser-module'
import {
  TermeneAuthService,
  AssociateScraperService,
  CompanyScraperService,
  PersonScraperService,
} from './services'

@Module({
  imports: [BrowserModule, CacheModule],
  providers: [
    TermeneAuthService,
    CompanyScraperService,
    AssociateScraperService,
    PersonScraperService,
  ],
  exports: [
    TermeneAuthService,
    CompanyScraperService,
    AssociateScraperService,
    PersonScraperService,
  ],
})
export class ExtractorModule {}
