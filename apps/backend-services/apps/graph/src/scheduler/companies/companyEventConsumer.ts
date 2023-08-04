import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { companySchema } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { EntityEventInfo } from '@app/scheduler-module'
import { AUTHOR, QUEUE_GRAPH_COMPANIES } from '../constants'
import { CompanyGraphService } from '../../graph/services/companyGraphService'

@Processor(QUEUE_GRAPH_COMPANIES)
export class CompanyEventConsumer extends WorkerHost {
  private readonly logger = new Logger(CompanyEventConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly companyGraphService: CompanyGraphService,
  ) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    await this.upsertCompanyNode(job.data.entityId)
  }

  private async upsertCompanyNode(entityId: string) {
    const companyModel = companySchema.parse(
      await this.ingressService.getEntity(
        { entityId: entityId, entityType: 'COMPANY' },
        true,
        AUTHOR,
      ),
    )

    if (companyModel) {
      await this.companyGraphService.upsertCompanyNode(entityId, companyModel)
    }
  }
}
