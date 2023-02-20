import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_EVENTS } from '@app/pub'
import { Queue } from 'bull'
import { EventEventInfo } from '@app/pub/types/incident'

@Injectable()
export class IncidentEventDispatcherService {
  constructor(@InjectQueue(QUEUE_EVENTS) private readonly queue: Queue<EventEventInfo>) {}

  dispatchIncidentCreated = async (incidentId: string) =>
    this.publishJob(EVENT_CREATED, {
      eventId: incidentId,
    })

  dispatchIncidentUpdated = async (incidentId: string) =>
    this.publishJob(EVENT_UPDATED, {
      eventId: incidentId,
    })

  dispatchIncidentsUpdated = async (incidentsIds: string[]) =>
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
