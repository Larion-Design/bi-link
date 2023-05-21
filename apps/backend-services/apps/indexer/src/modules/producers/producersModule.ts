import { Module } from '@nestjs/common'
import { SchedulerModule } from '@app/scheduler-module'
import { PersonEventDispatcherService } from './services/personEventDispatcherService'
import { CompanyEventDispatcherService } from './services/companyEventDispatcherService'
import { FileEventDispatcherService } from './services/fileEventDispatcherService'
import { EventDispatcherService } from './services/eventDispatcherService'
import { ProceedingEventDispatcherService } from './services/proceedingEventDispatcherService'
import { RelatedEntitiesSearchService } from './services/relatedEntitiesSearchService'
import {
  QUEUE_COMPANIES,
  QUEUE_FILES,
  QUEUE_EVENTS,
  QUEUE_PERSONS,
  QUEUE_PROPERTIES,
  QUEUE_REPORTS,
  QUEUE_PROCEEDINGS,
} from '../constants'
import { PropertyEventDispatcherService } from './services/propertyEventDispatcherService'
import { ReportEventDispatcherService } from './services/reportEventDispatcherService'

@Module({
  imports: [
    SchedulerModule.forRoot([
      QUEUE_PERSONS,
      QUEUE_COMPANIES,
      QUEUE_FILES,
      QUEUE_EVENTS,
      QUEUE_PROPERTIES,
      QUEUE_REPORTS,
      QUEUE_PROCEEDINGS,
    ]),
  ],
  providers: [
    PropertyEventDispatcherService,
    PersonEventDispatcherService,
    CompanyEventDispatcherService,
    FileEventDispatcherService,
    EventDispatcherService,
    RelatedEntitiesSearchService,
    ReportEventDispatcherService,
    ProceedingEventDispatcherService,
  ],
  exports: [
    PropertyEventDispatcherService,
    PersonEventDispatcherService,
    CompanyEventDispatcherService,
    FileEventDispatcherService,
    EventDispatcherService,
    ReportEventDispatcherService,
    RelatedEntitiesSearchService,
    ProceedingEventDispatcherService,
  ],
})
export class ProducersModule {}
