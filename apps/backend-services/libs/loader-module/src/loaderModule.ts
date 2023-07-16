import { RpcModule } from '@app/rpc'
import {
  CompanyLoaderService,
  LocationLoaderService,
  PersonLoaderService,
  ProceedingLoaderService,
} from './services'
import { Module } from '@nestjs/common'

@Module({
  imports: [RpcModule],
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
