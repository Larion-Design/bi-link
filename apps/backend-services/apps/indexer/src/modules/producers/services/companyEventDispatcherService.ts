import { Injectable, Logger } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_COMPANIES } from '../constants'
import { CompanyEventInfo } from '@app/pub/types/company'

@Injectable()
export class CompanyEventDispatcherService {
  private readonly logger = new Logger(CompanyEventDispatcherService.name)

  constructor(
    @InjectQueue(QUEUE_COMPANIES)
    private readonly queue: Queue<CompanyEventInfo>,
  ) {}

  dispatchCompanyCreated = async (companyId: string) =>
    this.publishJob(EVENT_CREATED, { companyId })

  dispatchCompanyUpdated = async (companyId: string) =>
    this.publishJob(EVENT_UPDATED, { companyId })

  dispatchCompaniesUpdated = async (companiesIds: string[]) =>
    this.queue.addBulk(
      companiesIds.map((companyId) => ({
        name: EVENT_UPDATED,
        data: {
          companyId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: CompanyEventInfo) => {
    try {
      const { id } = await this.queue.add(eventType, eventInfo)

      this.logger.debug(
        `Created job ${id} under process ${QUEUE_COMPANIES}:${eventType} for ID ${eventInfo.companyId}`,
      )
    } catch (error) {
      this.logger.error(error)
    }
  }
}
