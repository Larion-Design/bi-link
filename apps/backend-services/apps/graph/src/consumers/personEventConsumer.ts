import { PersonsService } from '@app/entities/services/personsService'
import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { QUEUE_GRAPH_PERSONS } from '../producers/constants'
import { EVENT_CREATED, EVENT_UPDATED, PersonEventInfo } from '@app/scheduler-module'
import { PersonGraphService } from './services/personGraphService'

@Processor(QUEUE_GRAPH_PERSONS)
export class PersonEventConsumer {
  private readonly logger = new Logger(PersonEventConsumer.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly personGraphService: PersonGraphService,
  ) {}

  @Process(EVENT_CREATED)
  async personCreated(job: Job<PersonEventInfo>) {
    const {
      data: { personId },
    } = job

    try {
      await this.personGraphService.upsertPersonNode(personId)
      return job.moveToCompleted()
    } catch (error) {
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async personUpdated(job: Job<PersonEventInfo>) {
    const {
      data: { personId },
    } = job

    try {
      await this.personGraphService.upsertPersonNode(personId)
      return job.moveToCompleted()
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }
}
