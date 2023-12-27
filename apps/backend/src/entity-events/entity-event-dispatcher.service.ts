import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Company, Person } from 'defs';
import { EVENT } from './events-handlers';

@Injectable()
export class EntityEventDispatcherService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  personCreated(person: Person) {
    return this.eventEmitter.emit(EVENT.PERSON_CREATED, person);
  }

  personUpdated(person: Person) {
    return this.eventEmitter.emit(EVENT.PERSON_UPDATED, person);
  }

  companyCreated(company: Company) {
    return this.eventEmitter.emit(EVENT.COMPANY_CREATED, company);
  }

  companyUpdated(company: Company) {
    return this.eventEmitter.emit(EVENT.COMPANY_UPDATED, company);
  }
}
