import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED } from '../constants'
import { PropertyEventInfo } from '@app/scheduler-module'

@Injectable()
export class PropertyEventSchedulerService {
  private readonly logger = new Logger(PropertyEventSchedulerService.name)
  protected readonly queue: Queue<PropertyEventInfo>

  dispatchPropertyCreated = async (propertyId: string) =>
    this.publishJob(EVENT_CREATED, { propertyId })

  dispatchPropertyUpdated = async (propertyId: string) =>
    this.publishJob(EVENT_UPDATED, { propertyId })

  dispatchPropertiesUpdated = async (propertiesIds: string[]) =>
    this.queue.addBulk(
      propertiesIds.map((propertyId) => ({
        name: EVENT_UPDATED,
        data: {
          propertyId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: PropertyEventInfo) => {
    try {
      const { id } = await this.queue.add(eventType, eventInfo)
      this.logger.debug(`Created job ${id} for event "${eventType}", ID "${eventInfo.propertyId}"`)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
