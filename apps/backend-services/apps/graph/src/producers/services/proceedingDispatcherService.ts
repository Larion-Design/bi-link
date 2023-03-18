import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { ProceedingEventInfo, ProceedingEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_GRAPH_PROCEEDINGS } from '../constants'

@Injectable()
export class ProceedingDispatcherService extends ProceedingEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_PROCEEDINGS)
    protected readonly queue: Queue<ProceedingEventInfo>,
  ) {
    super()
  }
}
