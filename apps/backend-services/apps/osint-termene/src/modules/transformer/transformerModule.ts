import { BrowserModule } from '@app/browser-module'
import { LoaderModule } from '@app/loader-module'
import { forwardRef, Module } from '@nestjs/common'
import { SchedulerModule } from '../scheduler'
import { AssociateDataTransformerService } from './services/associateDataTransformerService'
import { CompanyDataTransformerService } from './services/companyDataTransformerService'
import { LocationDataTransformerService } from './services/locationDataTransformerService'
import { ProceedingDataTransformer } from './services/proceedingDataTransformer'

@Module({
  imports: [LoaderModule, BrowserModule, forwardRef(() => SchedulerModule)],
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
