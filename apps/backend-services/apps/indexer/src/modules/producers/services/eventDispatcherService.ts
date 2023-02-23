import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { EventEventInfo } from '@app/pub/types/incident'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_EVENTS } from '../constants'

@Injectable()
export class EventDispatcherService {
  constructor(@InjectQueue(QUEUE_EVENTS) private readonly queue: Queue<EventEventInfo>) {}

  dispatchEventCreated = async (incidentId: string) =>
    this.publishJob(EVENT_CREATED, {
      eventId: incidentId,
    })

  dispatchEventUpdated = async (incidentId: string) =>
    this.publishJob(EVENT_UPDATED, {
      eventId: incidentId,
    })

  dispatchEventsUpdated = async (incidentsIds: string[]) =>
    this.queue.addBulk(
      incidentsIds.map((incidentId) => ({
        name: EVENT_UPDATED,
        data: {
          eventId: incidentId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: EventEventInfo) =>
    this.queue.add(eventType, eventInfo)
}
