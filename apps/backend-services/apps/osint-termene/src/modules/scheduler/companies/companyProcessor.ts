import { CompanyLoaderService } from '@app/loader-module'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { CompanyAPIInput } from 'defs'
import { AUTHOR } from '../../../constants'
import { CompanyDatasetScraperService } from '../../extractor'
import { CompanyDataTransformerService } from '../../transformer/services/companyDataTransformerService'
import { EVENT_IMPORT, EVENT_LOAD, EVENT_TRANSFORM, QUEUE_COMPANIES } from '../constants'
import { CompanyProducerService } from './companyProducerService'
import { ProceedingProducerService } from '../proceedings/proceedingProducerService'
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
        data: { cui },
      } = job

      const companyScrapedData = await this.companyScraperService.getFullCompanyDataSet(cui)

      if (companyScrapedData) {
        await this.companyProducerService.transformCompany(cui, companyScrapedData)
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
        data: { cui, dataset },
      } = job

      const companyInfo = this.companyTransformService.transformCompanyData(cui, dataset)

      if (dataset.associates) {
        companyInfo.associates = await this.companyTransformService.transformAssociates(
          cui,
          dataset.associates,
        )
      }

      await this.companyProducerService.loadCompany(cui, companyInfo)

      if (dataset.courtCases?.rezultatele_cautarii.length) {
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
        data: { cui, companyInfo },
      } = job

      const companyId = await this.companyLoaderService.findCompany({ cui })

      if (!companyId) {
        await this.companyLoaderService.createCompany(companyInfo, AUTHOR)
      } else {
        const companyData = await this.companyLoaderService.getCompany(companyId, AUTHOR)
        await this.companyLoaderService.updateCompany(
          companyId,
          this.mergeCompanyData(companyData, companyInfo),
          AUTHOR,
        )
      }
      return {}
    } catch (e) {
      return job.moveToFailed(e as { message: string })
    }
  }

  private mergeCompanyData(oldCompanyInfo: CompanyAPIInput, newCompanyInfo: CompanyAPIInput) {
    oldCompanyInfo.name = newCompanyInfo.name
    oldCompanyInfo.cui = newCompanyInfo.cui
    oldCompanyInfo.registrationNumber = newCompanyInfo.registrationNumber
    oldCompanyInfo.associates = newCompanyInfo.associates
    oldCompanyInfo.balanceSheets = newCompanyInfo.balanceSheets
    oldCompanyInfo.activityCodes = newCompanyInfo.activityCodes
    oldCompanyInfo.status = newCompanyInfo.status
    oldCompanyInfo.registrationDate = newCompanyInfo.registrationDate
    oldCompanyInfo.contactDetails = newCompanyInfo.contactDetails
    return oldCompanyInfo
  }
}
