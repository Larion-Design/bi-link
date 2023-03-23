import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { PropertyEventInfo, PropertyEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_GRAPH_PROPERTIES } from '../constants'

@Injectable()
export class PropertyDispatcherService extends PropertyEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_PROPERTIES)
    protected readonly queue: Queue<PropertyEventInfo>,
  ) {
    super()
  }
}
