import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { CompanyEventSchedulerService, CompanyEventInfo } from '@app/scheduler-module'
import { QUEUE_GRAPH_COMPANIES } from '../constants'

@Injectable()
export class CompanyGraphDispatcherService extends CompanyEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_COMPANIES)
    protected readonly queue: Queue<CompanyEventInfo>,
  ) {
    super()
  }
}
