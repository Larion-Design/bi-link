import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { CompanyEventInfo, CompanyEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_COMPANIES } from '../constants'

@Injectable()
export class CompanyEventDispatcherService extends CompanyEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_COMPANIES)
    protected readonly queue: Queue<CompanyEventInfo>,
  ) {
    super()
  }
}
