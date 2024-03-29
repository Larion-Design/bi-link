import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { Company, Person } from 'defs'
import {
  EVENT,
  OnCompanyCreated,
  OnCompanyUpdated,
  OnPersonCreated,
  OnPersonUpdated,
} from '@modules/entity-events'
import { CompanyGraphService } from './companyGraphService'
import { PersonGraphService } from './personGraphService'

@Injectable()
export class GraphEventsHandlerService
  implements OnPersonCreated, OnPersonUpdated, OnCompanyCreated, OnCompanyUpdated
{
  constructor(
    private readonly personGraphService: PersonGraphService,
    private readonly companyGraphService: CompanyGraphService,
  ) {}

  @OnEvent(EVENT.PERSON_CREATED, { suppressErrors: false })
  async onPersonCreated(person: Person) {
    await this.personGraphService.upsertPersonNode(person._id, person)
  }

  @OnEvent(EVENT.PERSON_UPDATED, { suppressErrors: false })
  async onPersonUpdated(person: Person) {
    await this.personGraphService.upsertPersonNode(person._id, person)
  }

  @OnEvent(EVENT.COMPANY_CREATED, { suppressErrors: false })
  async onCompanyCreated(company: Company) {
    await this.companyGraphService.upsertCompanyNode(company._id, company)
  }

  @OnEvent(EVENT.COMPANY_UPDATED, { suppressErrors: false })
  async onCompanyUpdated(company: Company) {
    await this.companyGraphService.upsertCompanyNode(company._id, company)
  }
}
