import { Module } from '@nestjs/common'
import {
  CompanyLoaderService,
  LocationLoaderService,
  PersonLoaderService,
} from '@app/loader-module/services'

@Module({
  providers: [PersonLoaderService, CompanyLoaderService, LocationLoaderService],
  exports: [PersonLoaderService, CompanyLoaderService, LocationLoaderService],
})
export class LoaderModule {}
