import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger } from '@nestjs/common'
import { EntityEventInfo } from '@app/scheduler-module'
import { EntityInfo, Person } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { PersonsIndexerService } from '../../indexer/services'
import { AUTHOR, QUEUE_PERSONS } from '../../constants'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'

@Processor(QUEUE_PERSONS)
export class PersonIndexEventsConsumer extends WorkerHost {
  private readonly logger = new Logger(PersonIndexEventsConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly personsIndexerService: PersonsIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    await this.indexPersonInfo(job.data.entityId)
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
