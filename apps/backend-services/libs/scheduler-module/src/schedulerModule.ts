import { Module } from '@nestjs/common'
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
export class SchedulerModule {}
