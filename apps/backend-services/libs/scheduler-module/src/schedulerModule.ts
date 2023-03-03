import {
  CompanyEventSchedulerService,
  EventSchedulerService,
  PersonEventSchedulerService,
  PropertyEventSchedulerService,
} from '@app/scheduler-module/services'
import { Module } from '@nestjs/common'

@Module({
  providers: [
    PersonEventSchedulerService,
    CompanyEventSchedulerService,
    PropertyEventSchedulerService,
    EventSchedulerService,
  ],
  exports: [
    PersonEventSchedulerService,
    CompanyEventSchedulerService,
    PropertyEventSchedulerService,
    EventSchedulerService,
  ],
})
export class SchedulerModule {}
