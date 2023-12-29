import {
  EVENT,
  OnCompanyCreated,
  OnCompanyUpdated,
  OnPersonCreated,
  OnPersonUpdated,
} from '@modules/entity-events'
import { CompaniesIndexerService, PersonsIndexerService } from '@modules/search/services/index'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { Company, Person } from 'defs'

@Injectable()
export class SearchEventsHandlerService
  implements OnPersonCreated, OnPersonUpdated, OnCompanyCreated, OnCompanyUpdated
{
  constructor(
    private readonly personsIndexerService: PersonsIndexerService,
    private readonly companiesIndexerService: CompaniesIndexerService,
  ) {}

  @OnEvent(EVENT.PERSON_CREATED)
  async onPersonCreated(person: Person) {
    await this.personsIndexerService.indexPerson(person._id, person)
  }

  @OnEvent(EVENT.PERSON_UPDATED)
  async onPersonUpdated(person: Person) {
    await this.personsIndexerService.indexPerson(person._id, person)
  }

  @OnEvent(EVENT.COMPANY_UPDATED)
  async onCompanyUpdated(company: Company) {
    await this.companiesIndexerService.indexCompany(company._id, company)
  }

  @OnEvent(EVENT.COMPANY_CREATED)
  async onCompanyCreated(company: Company) {
    await this.companiesIndexerService.indexCompany(company._id, company)
  }
}
