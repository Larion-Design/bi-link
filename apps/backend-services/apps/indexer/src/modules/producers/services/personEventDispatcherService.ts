import { PersonEventInfo, PersonEventSchedulerService } from '@app/scheduler-module'
import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { QUEUE_PERSONS } from '../constants'

@Injectable()
export class PersonEventDispatcherService extends PersonEventSchedulerService {
  constructor(
    @InjectQueue(QUEUE_PERSONS)
    protected readonly queue: Queue<PersonEventInfo>,
  ) {
    super()
  }
}
