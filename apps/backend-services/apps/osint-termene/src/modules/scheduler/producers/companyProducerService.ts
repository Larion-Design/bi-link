import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { CompanyAPIInput } from 'defs'
import { CompanyTermeneDataset } from '../../../schema/company'
import {
  EVENT_IMPORT,
  EVENT_LOAD,
  EVENT_TRANSFORM,
  EVENT_TRANSFORM_ASSOCIATES,
  EVENT_UPDATE,
  QUEUE_COMPANIES,
} from '../constants'
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
        opts: { jobId: cui },
      })),
    )

  updateCompany = async (companyId: string, cui: string) =>
    this.queue.add(EVENT_UPDATE, { cui, companyId }, { jobId: companyId })

  transformCompany = async (cui: string, dataset: CompanyTermeneDataset, companyId?: string) =>
    this.queue.add(
      EVENT_TRANSFORM,
      {
        cui,
        companyId,
        dataset,
      },
      { jobId: cui },
    )

  transformAssociates = async (
    cui: string,
    dataset: CompanyTermeneDataset,
    companyInfo: CompanyAPIInput,
    companyId?: string,
  ) =>
    this.queue.add(
      EVENT_TRANSFORM_ASSOCIATES,
      {
        cui,
        dataset,
        companyInfo,
        companyId,
      },
      { jobId: cui },
    )

  loadCompany = async (companyInfo: CompanyAPIInput, companyId?: string) =>
    this.queue.add(EVENT_LOAD, { companyId, companyInfo }, { jobId: companyId })
}
