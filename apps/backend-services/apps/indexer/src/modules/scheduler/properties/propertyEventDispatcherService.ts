import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'
import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { QUEUE_PROPERTIES } from '../../constants'
import { Queue } from 'bull'

@Injectable()
export class PropertyEventDispatcherService extends EntityEventSchedulerService {
  constructor(@InjectQueue(QUEUE_PROPERTIES) protected readonly queue: Queue<EntityEventInfo>) {
    super()
  }
}
