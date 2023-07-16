import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { QUEUE_REPORTS } from '../../constants'

@Injectable()
export class ReportEventDispatcherService extends EntityEventSchedulerService {
  constructor(@InjectQueue(QUEUE_REPORTS) protected readonly queue: Queue<EntityEventInfo>) {
    super()
  }
}
