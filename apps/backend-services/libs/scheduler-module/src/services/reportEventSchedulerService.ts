import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED, ReportEventInfo } from '@app/scheduler-module'

@Injectable()
export class ReportEventSchedulerService {
  private readonly logger = new Logger(ReportEventSchedulerService.name)
  protected readonly queue: Queue<ReportEventInfo>

  dispatchReportCreated = async (reportId: string) => this.publishJob(EVENT_CREATED, { reportId })

  dispatchReportUpdated = async (reportId: string) => this.publishJob(EVENT_UPDATED, { reportId })

  dispatchReportsUpdated = async (reportsIds: string[]) =>
    this.queue.addBulk(
      reportsIds.map((reportId) => ({
        name: EVENT_UPDATED,
        data: {
          reportId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: ReportEventInfo) => {
    try {
      const { id } = await this.queue.add(eventType, eventInfo)
      this.logger.debug(`Created job ${id} for event "${eventType}", ID "${eventInfo.reportId}"`)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
