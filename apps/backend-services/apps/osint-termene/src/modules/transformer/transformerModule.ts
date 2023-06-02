import { BrowserModule } from '@app/browser-module'
import { LoaderModule } from '@app/loader-module'
import { Module } from '@nestjs/common'
import { AssociateDataTransformerService } from './services/associateDataTransformerService'
import { CompanyDataTransformerService } from './services/companyDataTransformerService'
import { LocationDataTransformerService } from './services/locationDataTransformerService'
import { ProceedingDataTransformer } from './services/proceedingDataTransformer'

@Module({
  imports: [LoaderModule, BrowserModule],
  providers: [
    AssociateDataTransformerService,
    CompanyDataTransformerService,
    LocationDataTransformerService,
    ProceedingDataTransformer,
  ],
  exports: [
    AssociateDataTransformerService,
    CompanyDataTransformerService,
    LocationDataTransformerService,
    ProceedingDataTransformer,
  ],
})
export class TransformerModule {}
