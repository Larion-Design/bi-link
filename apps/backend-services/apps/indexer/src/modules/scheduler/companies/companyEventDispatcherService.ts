import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { EntityEventInfo, EntityEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_COMPANIES } from '../../constants'

@Injectable()
export class CompanyEventDispatcherService extends EntityEventSchedulerService {
  constructor(@InjectQueue(QUEUE_COMPANIES) protected readonly queue: Queue<EntityEventInfo>) {
    super()
  }
}
