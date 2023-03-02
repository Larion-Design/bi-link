import { Logger } from '@nestjs/common'
import { Job } from 'bull'
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { QUEUE_GRAPH_PROPERTIES } from '../producers/constants'
import { EVENT_CREATED, EVENT_UPDATED, PropertyEventInfo } from '@app/scheduler-module'
import { PropertiesService } from '@app/models/services/propertiesService'
import { PropertyGraphService } from './services/propertyGraphService'

@Processor(QUEUE_GRAPH_PROPERTIES)
export class PropertyEventConsumer {
  private readonly logger = new Logger(PropertyEventConsumer.name)

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertyGraphService: PropertyGraphService,
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
  async propertyCreated(job: Job<PropertyEventInfo>) {
    const {
      data: { propertyId },
    } = job

    try {
      await this.propertyGraphService.upsertPropertyNode(propertyId)
      return job.moveToCompleted()
    } catch (error) {
      return job.moveToFailed(error as { message: string })
    }
  }

  @Process(EVENT_UPDATED)
  async propertyUpdated(job: Job<PropertyEventInfo>) {
    const {
      data: { propertyId },
    } = job

    try {
      await this.propertyGraphService.upsertPropertyNode(propertyId)
      return job.moveToCompleted()
    } catch (error) {
      this.logger.error(error)
      return job.moveToFailed(error as { message: string })
    }
  }
}
