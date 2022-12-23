import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'
import { EVENT_CREATED, EVENT_UPDATED, QUEUE_PERSONS } from '../constants'
import { PersonEventInfo } from '@app/pub/types/person'

@Injectable()
export class PersonEventDispatcherService {
  constructor(@InjectQueue(QUEUE_PERSONS) private readonly queue: Queue<PersonEventInfo>) {}

  private publishJob = async (eventType: string, eventInfo: PersonEventInfo) =>
    this.queue.add(eventType, eventInfo)

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
}
