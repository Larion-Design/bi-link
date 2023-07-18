import { CacheModule } from '@app/cache'
import { LoaderModule } from '@app/loader-module'
import { BullModule } from '@nestjs/bull'
import { forwardRef, Module } from '@nestjs/common'
import { ExtractorModule } from '../extractor'
import { TransformerModule } from '../transformer'
import { QUEUE_COMPANIES, QUEUE_PERSONS, QUEUE_PROCEEDINGS } from './constants'
import { CompanyProcessor } from './companies/companyProcessor'
import { PersonProcessor } from './persons/personProcessor'
import { ProceedingProceessor } from './proceedings/proceedingProceessor'
import { CompanyProducerService } from './companies/companyProducerService'
import { PersonProducerService } from './persons/personProducerService'
import { ProceedingProducerService } from './proceedings/proceedingProducerService'
import { TermeneCacheService } from './termeneCacheService'

@Module({
  imports: [
    CacheModule,
    ExtractorModule,
    forwardRef(() => TransformerModule),
    LoaderModule,
    BullModule.registerQueue(
      { name: QUEUE_PERSONS },
      { name: QUEUE_COMPANIES },
      { name: QUEUE_PROCEEDINGS },
    ),
  ],
  providers: [
    TermeneCacheService,
    CompanyProcessor,
    PersonProcessor,
    ProceedingProceessor,
    CompanyProducerService,
    PersonProducerService,
    ProceedingProducerService,
  ],
  exports: [
    TermeneCacheService,
    CompanyProcessor,
    PersonProcessor,
    ProceedingProceessor,
    CompanyProducerService,
    PersonProducerService,
    ProceedingProducerService,
  ],
})
export class SchedulerModule {}
