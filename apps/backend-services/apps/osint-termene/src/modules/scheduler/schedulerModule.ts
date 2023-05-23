import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { QUEUE_COMPANIES, QUEUE_PERSONS, QUEUE_PROCEEDINGS } from './constants'

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_PERSONS },
      { name: QUEUE_COMPANIES },
      { name: QUEUE_PROCEEDINGS },
    ),
  ],
  providers: [],
  exports: [],
})
export class SchedulerModule {}
