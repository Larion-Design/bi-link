import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'
import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { QUEUE_EVENTS } from '../../constants'

@Injectable()
export class EventDispatcherService extends EntityEventSchedulerService {
  constructor(@InjectQueue(QUEUE_EVENTS) protected readonly queue: Queue<EntityEventInfo>) {
    super()
  }
}
