import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { ReportEventInfo, ReportEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_GRAPH_REPORTS } from '../constants'

@Injectable()
export class ReportDispatcherService extends ReportEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_REPORTS)
    protected readonly queue: Queue<ReportEventInfo>,
  ) {
    super()
  }
}
