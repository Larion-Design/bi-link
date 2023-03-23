import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { PersonEventInfo, PersonEventSchedulerService } from '@app/scheduler-module'
import { QUEUE_GRAPH_PERSONS } from '../constants'

@Injectable()
export class PersonDispatcherService extends PersonEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_GRAPH_PERSONS)
    protected readonly queue: Queue<PersonEventInfo>,
  ) {
    super()
  }
}
