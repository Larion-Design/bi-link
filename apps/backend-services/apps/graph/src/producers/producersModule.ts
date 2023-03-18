import { SchedulerModule } from '@app/scheduler-module'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import {
  QUEUE_GRAPH_COMPANIES,
  QUEUE_GRAPH_EVENTS,
  QUEUE_GRAPH_FILES,
  QUEUE_GRAPH_PERSONS,
  QUEUE_GRAPH_PROCEEDINGS,
  QUEUE_GRAPH_PROPERTIES,
  QUEUE_GRAPH_REPORTS,
} from './constants'
import { CompanyDispatcherService } from './services/companyDispatcherService'
import { EventDispatcherService } from './services/eventDispatcherService'
import { PersonDispatcherService } from './services/personDispatcherService'
import { ProceedingDispatcherService } from './services/proceedingDispatcherService'
import { PropertyDispatcherService } from './services/propertyDispatcherService'
import { ReportDispatcherService } from './services/reportDispatcherService'

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
      { name: QUEUE_GRAPH_PROCEEDINGS },
    ),
  ],
  providers: [
    PersonDispatcherService,
    CompanyDispatcherService,
    PropertyDispatcherService,
    EventDispatcherService,
    ProceedingDispatcherService,
    ReportDispatcherService,
  ],
  exports: [
    PersonDispatcherService,
    CompanyDispatcherService,
    PropertyDispatcherService,
    EventDispatcherService,
    ProceedingDispatcherService,
    ReportDispatcherService,
  ],
})
export class ProducersModule {}
