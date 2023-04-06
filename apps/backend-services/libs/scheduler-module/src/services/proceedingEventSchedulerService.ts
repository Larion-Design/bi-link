import { EVENT_CREATED, EVENT_UPDATED } from '@app/scheduler-module'
import { ProceedingEventInfo } from '@app/scheduler-module/types/proceeding'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'

@Injectable()
export class ProceedingEventSchedulerService {
  private readonly logger = new Logger(ProceedingEventSchedulerService.name)
  protected readonly queue: Queue<ProceedingEventInfo> | undefined

  dispatchProceedingCreated = async (proceedingId: string) =>
    this.publishJob(EVENT_CREATED, { proceedingId })

  dispatchProceedingUpdated = async (proceedingId: string) =>
    this.publishJob(EVENT_UPDATED, { proceedingId })

  dispatchProceedingsUpdated = async (proceedingsIds: string[]) =>
    this.queue?.addBulk(
      proceedingsIds.map((proceedingId) => ({
        name: EVENT_UPDATED,
        data: {
          proceedingId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: ProceedingEventInfo) => {
    try {
      const job = await this.queue?.add(eventType, eventInfo)

      if (job) {
        this.logger.debug(
          `Created job ${job.id} for event "${eventType}", ID "${eventInfo.proceedingId}"`,
        )
      }
    } catch (error) {
      this.logger.error(error)
    }
  }
}
