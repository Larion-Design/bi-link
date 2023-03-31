import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  OnQueueStalled,
  Process,
  Processor,
} from '@nestjs/bull'
import { Job } from 'bull'
import { Logger } from '@nestjs/common'
import { Company } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import {
  CompanyEventInfo,
  EVENT_CREATED,
  EVENT_UPDATED,
  FileParentEntity,
} from '@app/scheduler-module'
import { QUEUE_COMPANIES } from '../../constants'
import { FileEventDispatcherService } from '../../producers/services/fileEventDispatcherService'
import { CompaniesIndexerService } from '../../indexer/services'

@Processor(QUEUE_COMPANIES)
export class CompanyIndexEventsConsumer {
  private readonly logger = new Logger(CompanyIndexEventsConsumer.name)

  constructor(
    private readonly companiesIndexerService: CompaniesIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
    private readonly ingressService: IngressService,
  ) {}

  @OnQueueActive()
  onQueueActive({ id, name }: Job) {
    this.logger.debug(`Processing job ID ${id} (${name})`)
  }

  @OnQueueCompleted()
  onQueueCompleted({ id, name }: Job) {
    this.logger.debug(`Completed job ID ${id} (${name})`)
  }

  @OnQueueFailed()
  onQueueFailed({ id, name, failedReason }: Job) {
    this.logger.error(`Failed job ID ${id} (${name}) - ${String(failedReason)}`)
  }

  @OnQueueStalled()
  onQueueStalled({ id, name }: Job) {
    this.logger.error(`Job stalled ${id} (${name})`)
  }

  @Process(EVENT_CREATED)
  async companyCreated(job: Job<CompanyEventInfo>) {
    try {
      const {
        data: { companyId },
      } = job

      await this.indexCompanyInfo(companyId)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async companyUpdated(job: Job<CompanyEventInfo>) {
    try {
      const {
        data: { companyId },
      } = job

      await this.indexCompanyInfo(companyId)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  private indexCompanyInfo = async (companyId: string) => {
    const company = (await this.ingressService.getEntity(
      { entityId: companyId, entityType: 'COMPANY' },
      true,
      {
        type: 'SERVICE',
        sourceId: 'SERVICE_INDEXER',
      },
    )) as Company

    if (company) {
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
}
