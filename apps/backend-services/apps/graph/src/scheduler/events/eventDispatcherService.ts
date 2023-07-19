import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_GRAPH_EVENTS } from '../constants'

@Injectable()
export class EventDispatcherService extends EntityEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_EVENTS)
    protected readonly queue: Queue<EntityEventInfo>,
  ) {
    super()
  }
}