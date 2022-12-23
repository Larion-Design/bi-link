import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Logger } from '@nestjs/common'
import { PersonsIndexerService } from '../../indexer/person/services/personsIndexerService'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_PERSONS } from '../../producers/constants'
import { PersonEventInfo } from '@app/pub/types/person'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { PersonsService } from '@app/entities/services/personsService'
import { FileParentEntity } from '@app/pub/types/file'

@Processor(QUEUE_PERSONS)
export class PersonIndexEventsConsumer {
  private readonly logger = new Logger(PersonIndexEventsConsumer.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly personsIndexerService: PersonsIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {}

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
    const person = await this.personsService.find(personId)
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
