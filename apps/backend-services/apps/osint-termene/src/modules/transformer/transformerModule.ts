import { Module } from '@nestjs/common'
import { AssociateDataTransformerService } from './services/associateDataTransformerService'
import { CompanyDataTransformerService } from './services/companyDataTransformerService'
import { LocationDataTransformerService } from './services/locationDataTransformerService'

@Module({
  providers: [
    AssociateDataTransformerService,
    CompanyDataTransformerService,
    LocationDataTransformerService,
  ],
  exports: [
    AssociateDataTransformerService,
    CompanyDataTransformerService,
    LocationDataTransformerService,
  ],
})
export class TransformerModule {}
