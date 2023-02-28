import { SchedulerModule } from '@app/scheduler-module'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import {
  QUEUE_GRAPH_COMPANIES,
  QUEUE_GRAPH_EVENTS,
  QUEUE_GRAPH_FILES,
  QUEUE_GRAPH_PERSONS,
  QUEUE_GRAPH_PROPERTIES,
  QUEUE_GRAPH_REPORTS,
} from './constants'
import { CompanyGraphDispatcherService } from './services/companyGraphDispatcherService'
import { EventDispatcherService } from './services/eventDispatcherService'
import { PersonEventDispatcherService } from './services/personEventDispatcherService'
import { PropertyEventDispatcherService } from './services/propertyEventDispatcherService'

@Module({
  imports: [
    SchedulerModule,
    BullModule.registerQueue(
      { name: QUEUE_GRAPH_PERSONS },
      { name: QUEUE_GRAPH_COMPANIES },
      { name: QUEUE_GRAPH_PROPERTIES },
      { name: QUEUE_GRAPH_EVENTS },
      { name: QUEUE_GRAPH_REPORTS },
      { name: QUEUE_GRAPH_FILES },
    ),
  ],
  providers: [
    PersonEventDispatcherService,
    CompanyGraphDispatcherService,
    PropertyEventDispatcherService,
    EventDispatcherService,
  ],
  exports: [
    PersonEventDispatcherService,
    CompanyGraphDispatcherService,
    PropertyEventDispatcherService,
    EventDispatcherService,
  ],
})
export class ProducersModule {}
