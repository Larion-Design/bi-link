import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { companySchema } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CompanyEventInfo, EVENT_CREATED, EVENT_UPDATED } from '@app/scheduler-module'
import { QUEUE_GRAPH_COMPANIES } from '../producers/constants'
import { CompanyGraphService } from '../graph/services/companyGraphService'

@Processor(QUEUE_GRAPH_COMPANIES)
export class CompanyEventConsumer {
  private readonly logger = new Logger(CompanyEventConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly companyGraphService: CompanyGraphService,
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
  onQueueFailed({ id, name }: Job) {
    this.logger.debug(`Failed job ID ${id} (${name})`)
  }

  @Process(EVENT_CREATED)
  async companyCreated(job: Job<CompanyEventInfo>) {
    const {
      data: { companyId },
    } = job

    try {
      await this.upsertCompanyNode(companyId)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async companyUpdated(job: Job<CompanyEventInfo>) {
    const {
      data: { companyId },
    } = job

    try {
      await this.upsertCompanyNode(companyId)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  private upsertCompanyNode = async (companyId: string) => {
    const companyModel = companySchema.parse(
      await this.ingressService.getEntity({ entityId: companyId, entityType: 'COMPANY' }, true, {
        type: 'SERVICE',
        sourceId: 'SERVICE_GRAPH',
      }),
    )

    if (companyModel) {
      await this.companyGraphService.upsertCompanyNode(companyId, companyModel)
    }
  }
}
