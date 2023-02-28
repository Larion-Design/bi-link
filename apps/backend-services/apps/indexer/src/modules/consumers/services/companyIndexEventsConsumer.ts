import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Logger } from '@nestjs/common'
import {
  CompanyEventInfo,
  EVENT_CREATED,
  EVENT_UPDATED,
  FileParentEntity,
} from '@app/scheduler-module'
import { QUEUE_COMPANIES } from '../../producers/constants'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { CompaniesIndexerService } from '@app/search-tools-module/indexer/companiesIndexerService'
import { CompaniesService } from '@app/entities/services/companiesService'

@Processor(QUEUE_COMPANIES)
export class CompanyIndexEventsConsumer {
  private readonly logger = new Logger(CompanyIndexEventsConsumer.name)

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly companiesIndexerService: CompaniesIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
  ) {}

  @Process(EVENT_CREATED)
  async companyCreated(job: Job<CompanyEventInfo>) {
    try {
      const {
        data: { companyId },
      } = job

      if (await this.indexCompanyInfo(companyId)) {
        return job.moveToCompleted()
      }
      throw new Error(`Could not index company ID ${companyId}`)
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async companyUpdated(job: Job<CompanyEventInfo>) {
    try {
      const {
        data: { companyId },
      } = job

      if (await this.indexCompanyInfo(companyId)) {
        return job.moveToCompleted()
      }
      throw new Error(`Could not index company ID ${companyId}`)
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  private indexCompanyInfo = async (companyId: string) => {
    const company = await this.companiesService.getCompany(companyId, false)
    const indexingSuccessful = await this.companiesIndexerService.indexCompany(companyId, company)

    if (indexingSuccessful) {
      const filesIds = company.files.map(({ fileId }) => fileId)

      if (filesIds.length) {
        await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, {
          type: FileParentEntity.COMPANY,
          id: companyId,
        })
      }
      return true
    }
  }
}
