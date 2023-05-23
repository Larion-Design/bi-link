import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { CompanyAPIInput } from 'defs'
import { CompanyTermeneDataset } from '../../../schema/company'
import {
  EVENT_EXTRACT,
  EVENT_LOAD,
  EVENT_TRANSFORM,
  EVENT_TRANSFORM_ASSOCIATES,
  QUEUE_COMPANIES,
} from '../constants'
import { ExtractCompanyEvent, LoadCompanyEvent, TransformCompanyEvent } from '../types'

@Injectable()
export class CompanyProducerService {
  constructor(
    @InjectQueue(QUEUE_COMPANIES)
    private readonly queue: Queue<ExtractCompanyEvent | TransformCompanyEvent | LoadCompanyEvent>,
  ) {}

  extractCompanies = async (
    companiesCUI: string[],
    processAssociates: boolean,
    processProceedings: boolean,
  ) =>
    this.queue.addBulk(
      companiesCUI.map((cui) => ({
        name: EVENT_EXTRACT,
        data: { cui, processAssociates, processProceedings },
      })),
    )

  transformCompany = async (
    cui: string,
    dataset: CompanyTermeneDataset,
    processAssociates: boolean,
    processProceedings: boolean,
  ) => this.queue.add(EVENT_TRANSFORM, { cui, dataset, processAssociates, processProceedings })

  transformAssociates = async (
    cui: string,
    dataset: CompanyTermeneDataset,
    processProceedings: boolean,
    companyInfo: CompanyAPIInput,
    companyId?: string,
  ) =>
    this.queue.add(EVENT_TRANSFORM_ASSOCIATES, {
      cui,
      dataset,
      companyInfo,
      companyId,
      processProceedings,
    })

  loadCompany = async (companyInfo: CompanyAPIInput, companyId?: string) =>
    this.queue.add(EVENT_LOAD, { companyId, companyInfo })
}
