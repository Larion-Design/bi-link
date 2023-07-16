import { EntityEventSchedulerService } from '@app/scheduler-module/services/entityEventSchedulerService'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { EntityEventInfo } from '@app/scheduler-module'
import { QUEUE_GRAPH_PERSONS } from '../constants'

@Injectable()
export class PersonDispatcherService extends EntityEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_PERSONS)
    protected readonly queue: Queue<EntityEventInfo>,
  ) {
    super()
  }
}
