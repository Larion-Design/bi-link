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
import { Company, EntityInfo } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { EntityEventInfo, EVENT_CREATED, EVENT_UPDATED } from '@app/scheduler-module'
import { AUTHOR, QUEUE_COMPANIES } from '../../constants'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'
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
  async companyCreated(job: Job<EntityEventInfo>) {
    try {
      const {
        data: { entityId },
      } = job

      await this.indexCompanyInfo(entityId)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async companyUpdated(job: Job<EntityEventInfo>) {
    try {
      const {
        data: { entityId },
      } = job

      await this.indexCompanyInfo(entityId)
      return {}
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }

  private async indexCompanyInfo(entityId: string) {
    const entityInfo: EntityInfo = { entityId, entityType: 'COMPANY' }
    const company = (await this.ingressService.getEntity(entityInfo, true, AUTHOR)) as Company

    if (company) {
      const indexingSuccessful = await this.companiesIndexerService.indexCompany(entityId, company)

      if (indexingSuccessful) {
        const filesIds = company.files.map(({ fileId }) => fileId)

        if (filesIds.length) {
          await this.fileEventDispatcherService.dispatchFilesUpdated(filesIds, entityInfo)
        }
        return true
      }
    }
  }
}
