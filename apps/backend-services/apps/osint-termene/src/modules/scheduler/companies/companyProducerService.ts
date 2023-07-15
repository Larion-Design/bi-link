import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { CompanyAPIInput } from 'defs'
import { CompanyTermeneDataset } from '../../../schema/company'
import { EVENT_IMPORT, EVENT_LOAD, EVENT_TRANSFORM, QUEUE_COMPANIES } from '../constants'
import { ExtractCompanyEvent, LoadCompanyEvent, TransformCompanyEvent } from '../types'

@Injectable()
export class CompanyProducerService {
  constructor(
    @InjectQueue(QUEUE_COMPANIES)
    private readonly queue: Queue<ExtractCompanyEvent | TransformCompanyEvent | LoadCompanyEvent>,
  ) {}

  importCompanies = async (companiesCUI: string[]) =>
    this.queue.addBulk(
      companiesCUI.map((cui) => ({
        name: EVENT_IMPORT,
        data: { cui },
        opts: { delay: 5000 },
      })),
    )

  transformCompany = async (cui: string, dataset: CompanyTermeneDataset) =>
    this.queue.add(EVENT_TRANSFORM, { cui, dataset })

  loadCompany = async (cui: string, companyInfo: CompanyAPIInput) =>
    this.queue.add(EVENT_LOAD, { cui, companyInfo })
}
