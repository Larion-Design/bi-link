import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED } from '../constants'
import { CompanyEventInfo } from '../types'

@Injectable()
export class CompanyEventSchedulerService {
  private readonly logger = new Logger(CompanyEventSchedulerService.name)
  protected readonly queue: Queue<CompanyEventInfo>

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
      this.logger.debug(`Created job ${id} for event "${eventType}", ID "${eventInfo.companyId}"`)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
