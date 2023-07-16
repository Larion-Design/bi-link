import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull'
import { Job } from 'bull'
import { Logger } from '@nestjs/common'
import { EVENT_CREATED, EVENT_UPDATED, EntityEventInfo } from '@app/scheduler-module'
import { EntityInfo, Person } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { PersonsIndexerService } from '../../indexer/services'
import { AUTHOR, QUEUE_PERSONS } from '../../constants'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'

@Processor(QUEUE_PERSONS)
export class PersonIndexEventsConsumer {
  private readonly logger = new Logger(PersonIndexEventsConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
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
  onQueueFailed({ id, name, failedReason }: Job) {
    this.logger.error(`Failed job ID ${id} (${name}) - ${String(failedReason)}`)
  }

  @OnQueueStalled()
  onQueueStalled({ id, name, failedReason }: Job) {
    this.logger.error(`Job stalled ${id} (${name}) - ${String(failedReason)}`)
  }

  @Process(EVENT_CREATED)
  async personCreated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      await this.indexPersonInfo(entityId)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async personUpdated(job: Job<EntityEventInfo>) {
    const {
      data: { entityId },
    } = job

    try {
      if (await this.indexPersonInfo(entityId)) {
        return {}
      }
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  private async indexPersonInfo(entityId: string) {
    const entityInfo: EntityInfo = { entityId, entityType: 'PERSON' }
    const person = (await this.ingressService.getEntity(entityInfo, true, AUTHOR)) as Person

    if (person) {
      const indexingSuccessful = await this.personsIndexerService.indexPerson(entityId, person)

      if (indexingSuccessful) {
        const filesIds = person.files.map(({ fileId }) => fileId)

        if (filesIds.length) {
          await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, entityInfo)
        }
        return true
      }
    }
  }
}
