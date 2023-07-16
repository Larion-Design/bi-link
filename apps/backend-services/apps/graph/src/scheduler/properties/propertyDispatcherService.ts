import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { EntityEventSchedulerService, EntityEventInfo } from '@app/scheduler-module'
import { QUEUE_GRAPH_PROPERTIES } from '../constants'

@Injectable()
export class PropertyDispatcherService extends EntityEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_PROPERTIES)
    protected readonly queue: Queue<EntityEventInfo>,
  ) {
    super()
  }
}
