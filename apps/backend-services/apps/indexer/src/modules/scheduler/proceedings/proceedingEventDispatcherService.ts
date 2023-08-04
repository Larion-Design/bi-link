import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { QUEUE_PROCEEDINGS } from '../../constants'
import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'

@Injectable()
export class ProceedingEventDispatcherService extends EntityEventSchedulerService {
  constructor(@InjectQueue(QUEUE_PROCEEDINGS) protected readonly queue: Queue<EntityEventInfo>) {
    super()
  }
}
