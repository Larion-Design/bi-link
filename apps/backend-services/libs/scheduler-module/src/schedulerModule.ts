import {
  CompanyEventSchedulerService,
  EventSchedulerService,
  PersonEventSchedulerService,
  PropertyEventSchedulerService,
} from '@app/scheduler-module/services'
import { Global, Module } from '@nestjs/common'

@Global()
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
