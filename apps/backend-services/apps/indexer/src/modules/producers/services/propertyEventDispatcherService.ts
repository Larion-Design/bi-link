import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_PROPERTIES } from '../constants'
import { Queue } from 'bull'
import { PropertyEventInfo } from '@app/pub/types/property'

@Injectable()
export class PropertyEventDispatcherService {
  constructor(@InjectQueue(QUEUE_PROPERTIES) private readonly queue: Queue<PropertyEventInfo>) {}

  dispatchPropertyCreated = async (propertyId: string, authorId?: string) =>
    this.publishJob(EVENT_CREATED, {
      propertyId,
      authorId,
    })

  dispatchPropertyUpdated = async (propertyId: string, authorId?: string) =>
    this.publishJob(EVENT_UPDATED, {
      propertyId,
      authorId,
    })

  dispatchPropertiesUpdated = async (propertiesIds: string[]) =>
    this.queue.addBulk(
      propertiesIds.map((propertyId) => ({
        name: EVENT_UPDATED,
        data: {
          propertyId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: PropertyEventInfo) =>
    this.queue.add(eventType, eventInfo)
}
