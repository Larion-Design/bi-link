import { ReportEventInfo } from '@app/pub/types/report'
import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_REPORTS } from '../constants'

@Injectable()
export class ReportEventDispatcherService {
  private readonly logger = new Logger(ReportEventDispatcherService.name)

  constructor(@InjectQueue(QUEUE_REPORTS) private readonly queue: Queue<ReportEventInfo>) {
    void this.queue.empty()
  }

  dispatchReportCreated = async (reportInfo: ReportEventInfo) =>
    this.publishJob(EVENT_CREATED, reportInfo)

  dispatchReportUpdated = async (reportInfo: ReportEventInfo) =>
    this.publishJob(EVENT_UPDATED, reportInfo)

  private publishJob = async (eventType: string, reportInfo: ReportEventInfo) => {
    try {
      const { id } = await this.queue.add(eventType, reportInfo)

      this.logger.debug(`Created job ${id} for report ID ${reportInfo.reportId}`)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
