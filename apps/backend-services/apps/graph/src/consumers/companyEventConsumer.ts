import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { CompaniesService } from '@app/models/services/companiesService'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { QUEUE_GRAPH_COMPANIES } from '../producers/constants'
import { CompanyEventInfo, EVENT_CREATED, EVENT_UPDATED } from '@app/scheduler-module'
import { CompanyGraphService } from './services/companyGraphService'

@Processor(QUEUE_GRAPH_COMPANIES)
export class CompanyEventConsumer {
  private readonly logger = new Logger(CompanyEventConsumer.name)

  constructor(
    private readonly companiesService: CompaniesService,
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
      await this.companyGraphService.upsertCompanyNode(companyId)
      return job.moveToCompleted()
    } catch (error) {
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async companyUpdated(job: Job<CompanyEventInfo>) {
    const {
      data: { companyId },
    } = job

    try {
      await this.companyGraphService.upsertCompanyNode(companyId)
      return job.moveToCompleted()
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }
}
