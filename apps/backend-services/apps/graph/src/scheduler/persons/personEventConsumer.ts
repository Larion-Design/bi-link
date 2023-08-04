import { IngressService } from '@app/rpc/microservices/ingress'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { personSchema } from 'defs'
import { AUTHOR, QUEUE_GRAPH_PERSONS } from '../constants'
import { EntityEventInfo } from '@app/scheduler-module'
import { PersonGraphService } from '../../graph/services/personGraphService'

@Processor(QUEUE_GRAPH_PERSONS)
export class PersonEventConsumer extends WorkerHost {
  private readonly logger = new Logger(PersonEventConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly personGraphService: PersonGraphService,
  ) {
    super()
  }

  async process(job: Job<EntityEventInfo>): Promise<void> {
    const {
      data: { entityId },
    } = job

    const personModel = await this.getPersonInfo(entityId)
    await this.personGraphService.upsertPersonNode(entityId, personModel)
  }

  private getPersonInfo = async (entityId: string) =>
    personSchema.parse(
      await this.ingressService.getEntity(
        {
          entityId,
          entityType: 'PERSON',
        },
        true,
        AUTHOR,
      ),
    )
}
