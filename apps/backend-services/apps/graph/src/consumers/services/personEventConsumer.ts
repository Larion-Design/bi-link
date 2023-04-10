import { IngressService } from '@app/rpc/microservices/ingress'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { personSchema } from 'defs'
import { QUEUE_GRAPH_PERSONS } from '../../producers/constants'
import { EVENT_CREATED, EVENT_UPDATED, PersonEventInfo } from '@app/scheduler-module'
import { PersonGraphService } from '../../graph/services/personGraphService'

@Processor(QUEUE_GRAPH_PERSONS)
export class PersonEventConsumer {
  private readonly logger = new Logger(PersonEventConsumer.name)

  constructor(
    private readonly ingressService: IngressService,
    private readonly personGraphService: PersonGraphService,
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
  async personCreated(job: Job<PersonEventInfo>) {
    const {
      data: { personId },
    } = job

    try {
      const personModel = await this.getPersonInfo(personId)
      await this.personGraphService.upsertPersonNode(personId, personModel)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async personUpdated(job: Job<PersonEventInfo>) {
    const {
      data: { personId },
    } = job

    try {
      const personModel = await this.getPersonInfo(personId)
      await this.personGraphService.upsertPersonNode(personId, personModel)
      return {}
    } catch (error) {
      this.logger.error(error)
      await job.moveToFailed(error as { message: string })
    }
  }

  private getPersonInfo = async (personId: string) =>
    personSchema.parse(
      await this.ingressService.getEntity(
        {
          entityId: personId,
          entityType: 'PERSON',
        },
        true,
        {
          type: 'SERVICE',
          sourceId: 'SERVICE_GRAPH',
        },
      ),
    )
}
