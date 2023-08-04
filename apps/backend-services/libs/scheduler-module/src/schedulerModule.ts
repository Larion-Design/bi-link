import { BullModule } from '@nestjs/bullmq'
import { DynamicModule, Module } from '@nestjs/common'
import { EntityEventSchedulerService } from '@app/scheduler-module/services'

@Module({
  providers: [EntityEventSchedulerService],
  exports: [EntityEventSchedulerService],
})
export class SchedulerModule {
  static forRoot(queues: string[]): DynamicModule {
    return BullModule.registerQueue(
      ...queues.map((queue) => ({ name: queue, sharedConnection: true })),
    )
  }
}
