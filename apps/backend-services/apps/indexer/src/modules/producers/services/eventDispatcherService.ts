import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { EventEventInfo } from '@app/pub/types/event'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_EVENTS } from '../constants'

@Injectable()
export class EventDispatcherService {
  constructor(@InjectQueue(QUEUE_EVENTS) private readonly queue: Queue<EventEventInfo>) {}

  dispatchEventCreated = async (eventId: string) =>
    this.publishJob(EVENT_CREATED, {
      eventId: eventId,
    })

  dispatchEventUpdated = async (eventId: string) =>
    this.publishJob(EVENT_UPDATED, {
      eventId: eventId,
    })

  dispatchEventsUpdated = async (eventsIds: string[]) =>
    this.queue.addBulk(
      eventsIds.map((eventId) => ({
        name: EVENT_UPDATED,
        data: {
          eventId: eventId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: EventEventInfo) =>
    this.queue.add(eventType, eventInfo)
}
