import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { QUEUE_PROCEEDINGS } from '../../constants'
import { ProceedingEventInfo, ProceedingEventSchedulerService } from '@app/scheduler-module'

@Injectable()
export class ProceedingEventDispatcherService extends ProceedingEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_PROCEEDINGS)
    protected readonly queue: Queue<ProceedingEventInfo>,
  ) {
    super()
  }
}
