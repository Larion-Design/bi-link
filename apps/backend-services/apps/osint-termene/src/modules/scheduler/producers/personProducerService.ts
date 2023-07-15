import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'

import { EVENT_IMPORT, QUEUE_PERSONS } from '../constants'
import { ExtractPersonEvent } from '../types'

@Injectable()
export class PersonProducerService {
  constructor(
    @InjectQueue(QUEUE_PERSONS)
    private readonly queue: Queue<ExtractPersonEvent>,
  ) {}

  extractPersonCompanies = async (personUrl: string) => this.queue.add(EVENT_IMPORT, { personUrl })
}
