import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { ImportedEntitiesCacheService } from '../../cache'

import { EVENT_IMPORT, QUEUE_PERSONS } from '../constants'
import { ExtractPersonEvent } from '../types'

@Injectable()
export class PersonProducerService {
  constructor(
    @InjectQueue(QUEUE_PERSONS)
    private readonly queue: Queue<ExtractPersonEvent>,
    private readonly importedEntitiesCacheService: ImportedEntitiesCacheService,
  ) {}

  async extractPersonsCompanies(personsUrls: string[], skipCache = false) {
    if (!skipCache) {
      const newPersons = await this.importedEntitiesCacheService.getNewPersons(personsUrls)

      if (newPersons.length) {
        await this.importedEntitiesCacheService.cachePersons(personsUrls)
        return this.queue.addBulk(
          newPersons.map((personUrl) => ({
            name: EVENT_IMPORT,
            data: { personUrl },
            opts: { delay: 5000 },
          })),
        )
      }
    } else {
      await this.importedEntitiesCacheService.cachePersons(personsUrls)
      return this.queue.addBulk(
        personsUrls.map((personUrl) => ({
          name: EVENT_IMPORT,
          data: { personUrl },
          opts: { delay: 5000 },
        })),
      )
    }
  }
}
