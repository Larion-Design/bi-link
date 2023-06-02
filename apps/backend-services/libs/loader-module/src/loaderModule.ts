import { ServiceCacheModule } from '@app/service-cache-module'
import {
  CompanyLoaderService,
  LocationLoaderService,
  PersonLoaderService,
  ProceedingLoaderService,
} from './services'
import { Module } from '@nestjs/common'

@Module({
  imports: [ServiceCacheModule],
  providers: [
    PersonLoaderService,
    CompanyLoaderService,
    LocationLoaderService,
    ProceedingLoaderService,
  ],
  exports: [
    PersonLoaderService,
    CompanyLoaderService,
    LocationLoaderService,
    ProceedingLoaderService,
  ],
})
export class LoaderModule {}
