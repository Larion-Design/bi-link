import { BullModule } from '@nestjs/bull'
import { DynamicModule, Module } from '@nestjs/common'
import {
  CompanyEventSchedulerService,
  EventSchedulerService,
  PersonEventSchedulerService,
  ProceedingEventSchedulerService,
  PropertyEventSchedulerService,
  ReportEventSchedulerService,
} from '@app/scheduler-module/services'

@Module({
  providers: [
    PersonEventSchedulerService,
    CompanyEventSchedulerService,
    PropertyEventSchedulerService,
    EventSchedulerService,
    ProceedingEventSchedulerService,
    ReportEventSchedulerService,
  ],
  exports: [
    PersonEventSchedulerService,
    CompanyEventSchedulerService,
    PropertyEventSchedulerService,
    EventSchedulerService,
    ProceedingEventSchedulerService,
    ReportEventSchedulerService,
  ],
})
export class SchedulerModule {
  static forRoot(queues: string[]): DynamicModule {
    return BullModule.registerQueue(...queues.map((queue) => ({ name: queue })))
  }
}
