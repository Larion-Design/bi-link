import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { ProceedingAPIInput } from 'defs'
import { TermeneProceeding } from '../../../schema/courtFiles'
import { QUEUE_PROCEEDINGS, EVENT_TRANSFORM, EVENT_LOAD } from '../constants'
import { LoadProceedingEvent, TransformProceedingEvent } from '../types'

@Injectable()
export class ProceedingProducerService {
  constructor(
    @InjectQueue(QUEUE_PROCEEDINGS)
    private readonly queue: Queue<TransformProceedingEvent | LoadProceedingEvent>,
  ) {}

  transformProceedings = async (proceedings: TermeneProceeding[]) =>
    this.queue.addBulk(
      proceedings.map((dataset) => ({
        name: EVENT_TRANSFORM,
        data: { dataset },
        opts: { jobId: dataset.id },
      })),
    )

  loadProceeding = async (proceedingInfo: ProceedingAPIInput) =>
    this.queue.add(EVENT_LOAD, { proceedingInfo })
}
