import { RpcModule } from '@app/rpc'
import { SchedulerModule } from '@app/scheduler-module'
import { Module } from '@nestjs/common'
import { CompanyEventConsumer } from './companies/companyEventConsumer'
import { EventConsumer } from './events/eventConsumer'
import { PersonEventConsumer } from './persons/personEventConsumer'
import { ProceedingEventConsumer } from './proceedings/proceedingEventConsumer'
import { PropertyEventConsumer } from './properties/propertyEventConsumer'
import { ReportEventConsumer } from './reports/reportEventConsumer'
import { GraphModule } from '../graph'
import {
  QUEUE_GRAPH_COMPANIES,
  QUEUE_GRAPH_EVENTS,
  QUEUE_GRAPH_FILES,
  QUEUE_GRAPH_PERSONS,
  QUEUE_GRAPH_PROCEEDINGS,
  QUEUE_GRAPH_PROPERTIES,
  QUEUE_GRAPH_REPORTS,
} from './constants'
import { CompanyDispatcherService } from './companies/companyDispatcherService'
import { EventDispatcherService } from './events/eventDispatcherService'
import { PersonDispatcherService } from './persons/personDispatcherService'
import { ProceedingDispatcherService } from './proceedings/proceedingDispatcherService'
import { PropertyDispatcherService } from './properties/propertyDispatcherService'
import { ReportDispatcherService } from './reports/reportDispatcherService'

@Module({
  imports: [
    RpcModule,
    GraphModule,
    SchedulerModule.forRoot([
      QUEUE_GRAPH_PERSONS,
      QUEUE_GRAPH_COMPANIES,
      QUEUE_GRAPH_PROPERTIES,
      QUEUE_GRAPH_EVENTS,
      QUEUE_GRAPH_REPORTS,
      QUEUE_GRAPH_FILES,
      QUEUE_GRAPH_PROCEEDINGS,
    ]),
  ],
  providers: [
    PersonDispatcherService,
    CompanyDispatcherService,
    PropertyDispatcherService,
    EventDispatcherService,
    ProceedingDispatcherService,
    ReportDispatcherService,
    PersonEventConsumer,
    PropertyEventConsumer,
    EventConsumer,
    CompanyEventConsumer,
    ProceedingEventConsumer,
    ReportEventConsumer,
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
export class GraphSchedulerModule {}
