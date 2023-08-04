import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_GRAPH_PROCEEDINGS } from '../constants'

@Injectable()
export class ProceedingDispatcherService extends EntityEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_PROCEEDINGS)
    protected readonly queue: Queue<EntityEventInfo>,
  ) {
    super()
  }
}
