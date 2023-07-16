import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { QUEUE_PROCEEDINGS } from '../../constants'
import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'

@Injectable()
export class ProceedingEventDispatcherService extends EntityEventSchedulerService {
  constructor(@InjectQueue(QUEUE_PROCEEDINGS) protected readonly queue: Queue<EntityEventInfo>) {
    super()
  }
}
