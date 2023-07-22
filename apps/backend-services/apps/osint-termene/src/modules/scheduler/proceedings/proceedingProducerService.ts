import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { id } from 'date-fns/locale'
import { ProceedingAPIInput } from 'defs'
import { TermeneProceeding } from '../../../schema/courtFiles'
import { ImportedEntitiesCacheService } from '../../cache'
import { QUEUE_PROCEEDINGS, EVENT_TRANSFORM, EVENT_LOAD } from '../constants'
import { LoadProceedingEvent, TransformProceedingEvent } from '../types'

@Injectable()
export class ProceedingProducerService {
  constructor(
    @InjectQueue(QUEUE_PROCEEDINGS)
    private readonly queue: Queue<TransformProceedingEvent | LoadProceedingEvent>,
    private readonly importedEntitiesCacheService: ImportedEntitiesCacheService,
  ) {}

  async transformProceedings(proceedings: TermeneProceeding[]) {
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
          opts: { delay: 5000 },
        })),
      )
    }
  }

  loadProceeding = async (proceedingInfo: ProceedingAPIInput) =>
    this.queue.add(EVENT_LOAD, { proceedingInfo })
}
