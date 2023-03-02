import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Logger } from '@nestjs/common'
import {
  EVENT_CREATED,
  EVENT_UPDATED,
  FileParentEntity,
  PersonEventInfo,
} from '@app/scheduler-module'
import { PersonsIndexerService } from '../../indexer/services/personsIndexerService'
import { QUEUE_PERSONS } from '../../producers/constants'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { PersonsService } from '@app/models/services/personsService'

@Processor(QUEUE_PERSONS)
export class PersonIndexEventsConsumer {
  private readonly logger = new Logger(PersonIndexEventsConsumer.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly personsIndexerService: PersonsIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {}

  @OnQueueActive()
  onQueueActive({ id, name }: Job) {
    this.logger.debug(`Processing job ID ${id} (${name})`)
  }

  @OnQueueCompleted()
  onQueueCompleted({ id, name }: Job) {
    this.logger.debug(`Completed job ID ${id} (${name})`)
  }

  @OnQueueFailed()
  onQueueFailed({ id, name }: Job) {
    this.logger.debug(`Failed job ID ${id} (${name})`)
  }

  @Process(EVENT_CREATED)
  async personCreated(job: Job<PersonEventInfo>) {
    const {
      data: { personId },
    } = job

    try {
      if (await this.indexPersonInfo(personId)) {
        return job.moveToCompleted()
      }
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
      if (await this.indexPersonInfo(personId)) {
        return job.moveToCompleted()
      }
      throw new Error(`Could not index person ${personId}`)
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  private indexPersonInfo = async (personId: string) => {
    const person = await this.personsService.find(personId, true)
    const indexingSuccessful = await this.personsIndexerService.indexPerson(personId, person)

    if (indexingSuccessful) {
      const filesIds = person.files.map(({ fileId }) => fileId)

      if (filesIds.length) {
        await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, {
          type: FileParentEntity.PERSON,
          id: personId,
        })
      }
      return true
    }
  }
}
