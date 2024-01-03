import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { Company, Person } from 'defs'
import { EVENT } from './events-handlers'

@Injectable()
export class EntityEventDispatcherService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async personCreated(person: Person) {
    await this.eventEmitter.emitAsync(EVENT.PERSON_CREATED, person)
  }

  async personUpdated(person: Person) {
    await this.eventEmitter.emitAsync(EVENT.PERSON_UPDATED, person)
  }

  async companyCreated(company: Company) {
    await this.eventEmitter.emitAsync(EVENT.COMPANY_CREATED, company)
  }

  async companyUpdated(company: Company) {
    await this.eventEmitter.emitAsync(EVENT.COMPANY_UPDATED, company)
  }
}
