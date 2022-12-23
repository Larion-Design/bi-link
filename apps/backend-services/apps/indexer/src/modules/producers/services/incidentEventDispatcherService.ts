import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_INCIDENTS } from '@app/pub'
import { Queue } from 'bull'
import { IncidentEventInfo } from '@app/pub/types/incident'

@Injectable()
export class IncidentEventDispatcherService {
  constructor(@InjectQueue(QUEUE_INCIDENTS) private readonly queue: Queue<IncidentEventInfo>) {}

  dispatchIncidentCreated = async (incidentId: string) =>
    this.publishJob(EVENT_CREATED, {
      incidentId,
    })

  dispatchIncidentUpdated = async (incidentId: string) =>
    this.publishJob(EVENT_UPDATED, {
      incidentId,
    })

  dispatchIncidentsUpdated = async (incidentsIds: string[]) =>
    this.queue.addBulk(
      incidentsIds.map((incidentId) => ({
        name: EVENT_UPDATED,
        data: {
          incidentId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: IncidentEventInfo) =>
    this.queue.add(eventType, eventInfo)
}
