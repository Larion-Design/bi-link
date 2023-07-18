import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { ProceedingAPIInput } from 'defs'
import { TermeneProceeding } from '../../../schema/courtFiles'
import { QUEUE_PROCEEDINGS, EVENT_TRANSFORM, EVENT_LOAD } from '../constants'
import { TermeneCacheService } from '../termeneCacheService'
import { LoadProceedingEvent, TransformProceedingEvent } from '../types'

@Injectable()
export class ProceedingProducerService {
  constructor(
    @InjectQueue(QUEUE_PROCEEDINGS)
    private readonly queue: Queue<TransformProceedingEvent | LoadProceedingEvent>,
    private readonly termeneCacheService: TermeneCacheService,
  ) {}

  async transformProceedings(proceedings: TermeneProceeding[]) {
    const map = new Map<string, TermeneProceeding>()
    proceedings.forEach((proceeding) => map.set(String(proceeding.id), proceeding))

    const newProceedings = await this.termeneCacheService.getNewProceedings(Array.from(map.keys()))

    if (newProceedings.length) {
      return this.queue.addBulk(
        newProceedings.map((id) => ({
          name: EVENT_TRANSFORM,
          data: { dataset: map.get(id) as TermeneProceeding },
          opts: { delay: 5000 },
        })),
      )
    }
  }

  loadProceeding = async (proceedingInfo: ProceedingAPIInput) =>
    this.queue.add(EVENT_LOAD, { proceedingInfo })
}
