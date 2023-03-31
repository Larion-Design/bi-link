import { ReportEventInfo, ReportEventSchedulerService } from '@app/scheduler-module'
import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { QUEUE_REPORTS } from '../../constants'

@Injectable()
export class ReportEventDispatcherService extends ReportEventSchedulerService {
  constructor(@InjectQueue(QUEUE_REPORTS) protected readonly queue: Queue<ReportEventInfo>) {
    super()
  }
}
