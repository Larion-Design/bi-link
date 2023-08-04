import { EntityEventInfo } from '@app/scheduler-module'
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { Logger } from '@nestjs/common'
import { Company, EntityInfo } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { AUTHOR, QUEUE_COMPANIES } from '../../constants'
import { FileEventDispatcherService } from '../files/fileEventDispatcherService'
import { CompaniesIndexerService } from '../../indexer/services'

@Processor(QUEUE_COMPANIES)
export class CompanyIndexEventsConsumer extends WorkerHost {
  private readonly logger = new Logger(CompanyIndexEventsConsumer.name)

  constructor(
    private readonly companiesIndexerService: CompaniesIndexerService,
    private readonly fileEventDispatcherService: FileEventDispatcherService,
    private readonly ingressService: IngressService,
  ) {
    super()
  }

  @OnWorkerEvent('active')
  onQueueActive({ id, name }: Job) {
    if (id) this.logger.debug(`Processing job ID ${id} (${name})`)
  }

  @OnWorkerEvent('completed')
  onQueueCompleted({ id, name }: Job) {
    if (id) this.logger.debug(`Completed job ID ${id} (${name})`)
  }

  @OnWorkerEvent('failed')
  onQueueFailed({ id, name, failedReason }: Job) {
    if (id) this.logger.error(`Failed job ID ${id} (${name}) - ${String(failedReason)}`)
  }

  @OnWorkerEvent('stalled')
  onQueueStalled({ id, name }: Job) {
    if (id) this.logger.error(`Job stalled ${id} (${name})`)
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    const {
      data: { entityId },
    } = job

    await this.indexCompanyInfo(entityId)
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
