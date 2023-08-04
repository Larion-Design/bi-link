import { ParentTask } from '@app/scheduler-module'
import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { ImportedEntitiesCacheService } from '../../cache'
import { EVENT_IMPORT, QUEUE_COMPANIES } from '../constants'
import { ProcessCompanyEvent } from '../types'

@Injectable()
export class CompanyProducerService {
  constructor(
    @InjectQueue(QUEUE_COMPANIES)
    private readonly queue: Queue<ProcessCompanyEvent>,
    private readonly importedEntitiesCacheService: ImportedEntitiesCacheService,
  ) {}

  async importCompanies(companiesCUI: string[], skipCache = false, parentTask?: ParentTask) {
    if (!skipCache) {
      const newCompanies = await this.importedEntitiesCacheService.getNewCompanies(companiesCUI)

      if (newCompanies.length) {
        await this.importedEntitiesCacheService.cacheCompanies(companiesCUI)
        return this.queue.addBulk(
          newCompanies.map((cui) => ({
            name: EVENT_IMPORT,
            data: { cui, stage: 'EXTRACT' },
            opts: { delay: 5000, parent: parentTask },
          })),
        )
      }
    } else {
      await this.importedEntitiesCacheService.cacheCompanies(companiesCUI)
      return this.queue.addBulk(
        companiesCUI.map((cui) => ({
          name: EVENT_IMPORT,
          data: { cui, stage: 'EXTRACT' },
          opts: { delay: 5000, parent: parentTask },
        })),
      )
    }
  }
}
