import { PropertyEventInfo, PropertyEventSchedulerService } from '@app/scheduler-module'
import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { QUEUE_PROPERTIES } from '../constants'
import { Queue } from 'bull'

@Injectable()
export class PropertyEventDispatcherService extends PropertyEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_PROPERTIES)
    protected readonly queue: Queue<PropertyEventInfo>,
  ) {
    super()
  }
}
