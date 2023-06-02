import { LoaderModule } from '@app/loader-module'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ExtractorModule } from '../extractor'
import { TransformerModule } from '../transformer/transformerModule'
import { QUEUE_COMPANIES, QUEUE_PERSONS, QUEUE_PROCEEDINGS } from './constants'
import { CompanyProcessor } from './processors/companyProcessor'
import { PersonProcessor } from './processors/personProcessor'
import { ProceedingProceessor } from './processors/proceedingProceessor'
import { CompanyProducerService } from './producers/companyProducerService'
import { PersonProducerService } from './producers/personProducerService'
import { ProceedingProducerService } from './producers/proceedingProducerService'

@Module({
  imports: [
    ExtractorModule,
    TransformerModule,
    LoaderModule,
    BullModule.registerQueue(
      { name: QUEUE_PERSONS },
      { name: QUEUE_COMPANIES },
      { name: QUEUE_PROCEEDINGS },
    ),
  ],
  providers: [
    CompanyProcessor,
    PersonProcessor,
    ProceedingProceessor,
    CompanyProducerService,
    PersonProducerService,
    ProceedingProducerService,
  ],
  exports: [
    CompanyProcessor,
    PersonProcessor,
    ProceedingProceessor,
    CompanyProducerService,
    PersonProducerService,
    ProceedingProducerService,
  ],
})
export class SchedulerModule {}
