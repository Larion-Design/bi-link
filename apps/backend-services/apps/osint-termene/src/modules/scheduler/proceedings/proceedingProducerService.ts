import { InjectQueue } from '@nestjs/bullmq'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { TermeneProceeding } from '../../../schema/courtFiles'
import { ImportedEntitiesCacheService } from '../../cache'
import { QUEUE_PROCEEDINGS, EVENT_TRANSFORM } from '../constants'
import { ProcessProceedingEvent } from '../types'

@Injectable()
export class ProceedingProducerService {
  constructor(
    @InjectQueue(QUEUE_PROCEEDINGS)
    private readonly queue: Queue<ProcessProceedingEvent>,
    private readonly importedEntitiesCacheService: ImportedEntitiesCacheService,
  ) {}

  async transformProceedings(
    proceedings: TermeneProceeding[],
    parentCompanyTask?: { queue: string; id: string },
  ) {
    const map = new Map<string, TermeneProceeding>()
    proceedings.forEach((proceeding) => map.set(String(proceeding.nr_dosar), proceeding))

    const newProceedings = await this.importedEntitiesCacheService.getNewProceedings(
      Array.from(map.keys()),
    )

    if (newProceedings.length) {
      await this.importedEntitiesCacheService.cacheProceedings(newProceedings)
      return this.queue.addBulk(
        newProceedings.map((fileNumber) => ({
          name: EVENT_TRANSFORM,
          data: { dataset: map.get(fileNumber) as TermeneProceeding },
          opts: { delay: 5000, parent: parentCompanyTask },
        })),
      )
    }
  }
}
