import { ProceedingLoaderService } from '@app/loader-module'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { AUTHOR } from '../../../constants'
import { ProceedingDataTransformer } from '../../transformer/services/proceedingDataTransformer'
import { EVENT_LOAD, EVENT_TRANSFORM, QUEUE_PROCEEDINGS } from '../constants'
import { ProceedingProducerService } from '../producers/proceedingProducerService'
import { LoadProceedingEvent, TransformProceedingEvent } from '../types'

@Processor(QUEUE_PROCEEDINGS)
export class ProceedingProceessor {
  constructor(
    private readonly proceedingProducerService: ProceedingProducerService,
    private readonly proceedingTransformerService: ProceedingDataTransformer,
    private readonly proceedingLoaderService: ProceedingLoaderService,
  ) {}

  @Process(EVENT_TRANSFORM)
  async transformProceeding(job: Job<TransformProceedingEvent>) {
    const {
      data: { dataset },
    } = job

    const existingProceedingId = await this.proceedingLoaderService.findProceeding(dataset.nr_dosar)

    if (!existingProceedingId) {
      const proceedingInfo = await this.proceedingTransformerService.transformProceeding(dataset)

      if (proceedingInfo) {
        await this.proceedingProducerService.loadProceeding(proceedingInfo)
      }
    }
    return {}
  }

  @Process(EVENT_LOAD)
  async loadProceeding(job: Job<LoadProceedingEvent>) {
    const {
      data: { proceedingInfo, proceedingId },
    } = job

    if (!proceedingId) {
      await this.proceedingLoaderService.createProceeding(proceedingInfo, AUTHOR)
    }
    return {}
  }
}
