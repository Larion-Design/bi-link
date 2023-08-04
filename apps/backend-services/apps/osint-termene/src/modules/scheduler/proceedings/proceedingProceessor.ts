import { ProceedingLoaderService } from '@app/loader-module'
import { TaskProgress } from '@app/scheduler-module'
import { Job } from 'bullmq'
import { WorkerHost, Processor } from '@nestjs/bullmq'
import { ProceedingAPIInput } from 'defs'
import { AUTHOR } from '../../../constants'
import { ProceedingDataTransformer } from '../../transformer/services/proceedingDataTransformer'
import { QUEUE_PROCEEDINGS } from '../constants'
import { ProcessProceedingEvent } from '../types'

@Processor(QUEUE_PROCEEDINGS)
export class ProceedingProceessor extends WorkerHost {
  constructor(
    private readonly proceedingTransformerService: ProceedingDataTransformer,
    private readonly proceedingLoaderService: ProceedingLoaderService,
  ) {
    super()
  }

  async process(job: Job<ProcessProceedingEvent>): Promise<void> {
    if (!job.progress) {
      await job.updateProgress({ stage: 'TRANSFORM' } as TaskProgress)
    }

    if ((job.progress as TaskProgress).stage === 'TRANSFORM') {
      const {
        data: { dataset },
      } = job

      if (dataset) {
        const proceedingInfo = await this.proceedingTransformerService.transformProceeding(dataset)

        if (proceedingInfo) {
          await job.updateData({ ...job.data, proceedingInfo })
          await job.updateProgress({ stage: 'LOAD' } as TaskProgress)
        }
      }
    }

    if ((job.progress as TaskProgress).stage === 'LOAD') {
      const {
        data: { proceedingInfo },
      } = job

      if (proceedingInfo) {
        await this.loadProceeding(proceedingInfo)
      }
    }
  }

  private async loadProceeding(proceedingInfo: ProceedingAPIInput) {
    const proceedingId = await this.proceedingLoaderService.findProceeding(
      proceedingInfo.fileNumber.value,
    )

    if (!proceedingId) {
      await this.proceedingLoaderService.createProceeding(proceedingInfo, AUTHOR)
    } else {
      await this.proceedingLoaderService.updateProceeding(proceedingId, proceedingInfo, AUTHOR)
    }
  }
}
