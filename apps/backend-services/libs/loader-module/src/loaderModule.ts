import { Module } from '@nestjs/common'
import {
  CompanyLoaderService,
  LocationLoaderService,
  PersonLoaderService,
  ProceedingLoaderService,
} from '@app/loader-module/services'

@Module({
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
