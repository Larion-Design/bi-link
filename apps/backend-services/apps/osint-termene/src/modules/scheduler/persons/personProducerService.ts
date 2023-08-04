import { ParentTask } from '@app/scheduler-module'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { ImportedEntitiesCacheService } from '../../cache'

import { EVENT_IMPORT, QUEUE_PERSONS } from '../constants'
import { ProcessPersonEvent } from '../types'

@Injectable()
export class PersonProducerService {
  constructor(
    @InjectQueue(QUEUE_PERSONS)
    private readonly queue: Queue<ProcessPersonEvent>,
    private readonly importedEntitiesCacheService: ImportedEntitiesCacheService,
  ) {}

  async extractPersonsCompanies(personsUrls: string[], skipCache = false, parentTask?: ParentTask) {
    if (!skipCache) {
      const newPersons = await this.importedEntitiesCacheService.getNewPersons(personsUrls)

      if (newPersons.length) {
        await this.importedEntitiesCacheService.cachePersons(personsUrls)
        return this.queue.addBulk(
          newPersons.map((personUrl) => ({
            name: EVENT_IMPORT,
            data: { personUrl },
            opts: { delay: 5000, parent: parentTask },
          })),
        )
      }
    } else {
      await this.importedEntitiesCacheService.cachePersons(personsUrls)
      return this.queue.addBulk(
        personsUrls.map((personUrl) => ({
          name: EVENT_IMPORT,
          data: { personUrl },
          opts: { delay: 5000, parent: parentTask },
        })),
      )
    }
  }
}
