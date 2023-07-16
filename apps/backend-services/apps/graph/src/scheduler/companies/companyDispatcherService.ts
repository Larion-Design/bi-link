import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_GRAPH_COMPANIES } from '../constants'

@Injectable()
export class CompanyDispatcherService extends EntityEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_COMPANIES) protected readonly queue: Queue<EntityEventInfo>,
  ) {
    super()
  }
}
