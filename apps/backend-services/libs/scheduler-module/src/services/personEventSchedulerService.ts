import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED } from '../constants'
import { PersonEventInfo } from '@app/scheduler-module'

@Injectable()
export class PersonEventSchedulerService {
  private readonly logger = new Logger(PersonEventSchedulerService.name)
  protected readonly queue: Queue<PersonEventInfo>

  dispatchPersonCreated = async (personId: string) => this.publishJob(EVENT_CREATED, { personId })

  dispatchPersonUpdated = async (personId: string) => this.publishJob(EVENT_UPDATED, { personId })

  dispatchPersonsUpdated = async (personsIds: string[]) =>
    this.queue.addBulk(
      personsIds.map((personId) => ({
        name: EVENT_UPDATED,
        data: {
          personId,
        },
      })),
    )

  private publishJob = async (eventType: string, eventInfo: PersonEventInfo) => {
    try {
      const { id } = await this.queue.add(eventType, eventInfo)
      this.logger.debug(`Created job ${id} for event "${eventType}", ID "${eventInfo.personId}"`)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
