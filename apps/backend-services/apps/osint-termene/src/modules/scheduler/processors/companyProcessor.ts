import { CompanyLoaderService } from '@app/loader-module'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { AUTHOR } from '../../../constants'
import { CompanyDatasetScraperService } from '../../extractor'
import { CompanyDataTransformerService } from '../../transformer/services/companyDataTransformerService'
import {
  EVENT_IMPORT,
  EVENT_UPDATE,
  EVENT_LOAD,
  EVENT_TRANSFORM,
  EVENT_TRANSFORM_ASSOCIATES,
  QUEUE_COMPANIES,
} from '../constants'
import { CompanyProducerService } from '../producers/companyProducerService'
import { ProceedingProducerService } from '../producers/proceedingProducerService'
import { ExtractCompanyEvent, LoadCompanyEvent, TransformCompanyEvent } from '../types'

@Processor(QUEUE_COMPANIES)
export class CompanyProcessor {
  constructor(
    private readonly companyScraperService: CompanyDatasetScraperService,
    private readonly companyProducerService: CompanyProducerService,
    private readonly proceedingProducerService: ProceedingProducerService,
    private readonly companyTransformService: CompanyDataTransformerService,
    private readonly companyLoaderService: CompanyLoaderService,
  ) {}

  @Process(EVENT_IMPORT)
  async importCompanyData(job: Job<ExtractCompanyEvent>) {
    try {
      const {
        data: { cui, processAssociates, processProceedings },
      } = job

      const companyScrapedData = await this.companyScraperService.getFullCompanyDataSet(cui)

      if (companyScrapedData) {
        await this.companyProducerService.transformCompany(
          cui,
          companyScrapedData,
          processAssociates,
          processProceedings,
        )
        return {}
      }
    } catch (e) {
      return job.moveToFailed(e as { message: string })
    }
  }

  @Process(EVENT_UPDATE)
  async updateCompanyData(job: Job<ExtractCompanyEvent>) {
    try {
      const {
        data: { companyId, cui, processAssociates, processProceedings },
      } = job

      const companyScrapedData = await this.companyScraperService.getFullCompanyDataSet(cui)

      if (companyScrapedData) {
        await this.companyProducerService.transformCompany(
          cui,
          companyScrapedData,
          processAssociates,
          processProceedings,
          companyId,
        )
        return {}
      }
    } catch (e) {
      return job.moveToFailed(e as { message: string })
    }
  }

  @Process(EVENT_TRANSFORM)
  async transformCompany(job: Job<TransformCompanyEvent>) {
    try {
      const {
        data: { companyId, cui, dataset, processAssociates, processProceedings },
      } = job

      const companyInfo = this.companyTransformService.transformCompanyData(cui, dataset)

      if (processAssociates) {
        await this.companyProducerService.transformAssociates(
          cui,
          dataset,
          processProceedings,
          companyInfo,
        )
      } else {
        await this.companyProducerService.loadCompany(companyInfo, companyId)
      }

      return {}
    } catch (e) {
      return job.moveToFailed(e as { message: string })
    }
  }

  @Process(EVENT_TRANSFORM_ASSOCIATES)
  async transformAssociates(job: Job<TransformCompanyEvent>) {
    try {
      const {
        data: { cui, dataset, companyInfo, companyId, processProceedings },
      } = job

      if (dataset.associates) {
        companyInfo.associates = await this.companyTransformService.transformAssociates(
          cui,
          dataset.associates,
        )
      }

      await this.companyProducerService.loadCompany(companyInfo, companyId)

      if (processProceedings && dataset.courtCases?.rezultatele_cautarii.length) {
        await this.proceedingProducerService.transformProceedings(
          dataset.courtCases.rezultatele_cautarii,
        )
      }
      return {}
    } catch (e) {
      return job.moveToFailed(e as { message: string })
    }
  }

  @Process(EVENT_LOAD)
  async loadCompany(job: Job<LoadCompanyEvent>) {
    try {
      const {
        data: { companyInfo, companyId },
      } = job

      if (companyInfo) {
        if (!companyId) {
          await this.companyLoaderService.createCompany(companyInfo, AUTHOR)
        } else {
          // TODO: update company data
        }
        return {}
      }
    } catch (e) {
      return job.moveToFailed(e as { message: string })
    }
  }
}
