import { EVENT_CREATED, EVENT_UPDATED, ReportEventInfo } from '@app/scheduler-module'
import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { QUEUE_REPORTS } from '../constants'

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
