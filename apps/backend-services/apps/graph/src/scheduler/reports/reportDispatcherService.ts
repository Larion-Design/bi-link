import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_GRAPH_REPORTS } from '../constants'

@Injectable()
export class ReportDispatcherService extends EntityEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_REPORTS)
    protected readonly queue: Queue<EntityEventInfo>,
  ) {
    super()
  }
}
