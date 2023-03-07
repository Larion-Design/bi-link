import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED } from '../constants'
import { EventEventInfo } from '@app/scheduler-module'

@Injectable()
export class EventSchedulerService {
  protected readonly logger = new Logger(EventSchedulerService.name)
  protected readonly queue: Queue<EventEventInfo>

  dispatchEventCreated = async (eventId: string) => this.publishJob(EVENT_CREATED, { eventId })

  dispatchEventUpdated = async (eventId: string) => this.publishJob(EVENT_UPDATED, { eventId })

  dispatchEventsUpdated = async (eventsIds: string[]) =>
    this.queue.addBulk(
      eventsIds.map((eventId) => ({
        name: EVENT_UPDATED,
        data: {
          eventId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: EventEventInfo) => {
    try {
      const { id } = await this.queue.add(eventType, eventInfo)
      this.logger.debug(`Created job ${id} for event "${eventType}", ID "${eventInfo.eventId}"`)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
