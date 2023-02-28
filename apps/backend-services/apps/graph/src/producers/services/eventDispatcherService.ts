import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { EventEventInfo, EventSchedulerService } from '@app/scheduler-module'
import { QUEUE_GRAPH_EVENTS } from '../constants'

@Injectable()
export class EventDispatcherService extends EventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_EVENTS)
    protected readonly queue: Queue<EventEventInfo>,
  ) {
    super()
  }
}
