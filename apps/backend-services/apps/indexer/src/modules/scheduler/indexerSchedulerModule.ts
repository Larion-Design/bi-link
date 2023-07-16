import { Module } from '@nestjs/common'
import {
  QUEUE_COMPANIES,
  QUEUE_EVENTS,
  QUEUE_FILES,
  QUEUE_PERSONS,
  QUEUE_PROCEEDINGS,
  QUEUE_PROPERTIES,
  QUEUE_REPORTS,
} from '../constants'
import { SchedulerModule } from '@app/scheduler-module'
import { IndexerModule } from '../indexer/indexerModule'
import { EventDispatcherService } from './events/eventDispatcherService'
import { FileEventDispatcherService } from './files/fileEventDispatcherService'
import { PersonEventDispatcherService } from './persons/personEventDispatcherService'
import { ProceedingEventDispatcherService } from './proceedings/proceedingEventDispatcherService'
import { PropertyEventDispatcherService } from './properties/propertyEventDispatcherService'
import { ReportEventDispatcherService } from './reports/reportEventDispatcherService'
import { SearchModule } from '../search/searchModule'
import { CompanyEventDispatcherService } from './companies/companyEventDispatcherService'
import { CompanyIndexEventsConsumer } from './companies/companyIndexEventsConsumer'
import { EventIndexEventsConsumer } from './events/eventIndexEventsConsumer'
import { FileIndexEventsConsumer } from './files/fileIndexEventsConsumer'
import { PersonIndexEventsConsumer } from './persons/personIndexEventsConsumer'
import { ProceedingIndexEventsConsumer } from './proceedings/proceedingIndexEventsConsumer'
import { PropertyIndexEventsConsumer } from './properties/propertyIndexEventsConsumer'

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
    IndexerModule,
    SearchModule,
  ],
  providers: [
    PersonIndexEventsConsumer,
    CompanyIndexEventsConsumer,
    FileIndexEventsConsumer,
    EventIndexEventsConsumer,
    PropertyIndexEventsConsumer,
    ProceedingIndexEventsConsumer,
    PropertyEventDispatcherService,
    PersonEventDispatcherService,
    CompanyEventDispatcherService,
    FileEventDispatcherService,
    EventDispatcherService,
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
    ProceedingEventDispatcherService,
  ],
})
export class IndexerSchedulerModule {}
