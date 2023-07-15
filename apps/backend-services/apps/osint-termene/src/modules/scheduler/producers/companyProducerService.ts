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
        data: { cui, processAssociates: true, processProceedings: true },
        opts: { jobId: cui },
      })),
    )

  updateCompany = async (companyId: string, cui: string) =>
    this.queue.add(
      EVENT_UPDATE,
      {
        cui,
        companyId,
        processAssociates: true,
        processProceedings: true,
      },
      { jobId: companyId },
    )

  transformCompany = async (
    cui: string,
    dataset: CompanyTermeneDataset,
    processAssociates: boolean,
    processProceedings: boolean,
    companyId?: string,
  ) =>
    this.queue.add(
      EVENT_TRANSFORM,
      {
        cui,
        companyId,
        dataset,
        processAssociates,
        processProceedings,
      },
      { jobId: cui },
    )

  transformAssociates = async (
    cui: string,
    dataset: CompanyTermeneDataset,
    processProceedings: boolean,
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
        processProceedings,
      },
      { jobId: cui },
    )

  loadCompany = async (companyInfo: CompanyAPIInput, companyId?: string) =>
    this.queue.add(EVENT_LOAD, { companyId, companyInfo }, { jobId: companyId })
}
