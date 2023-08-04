import { CompanyLoaderService } from '@app/loader-module'
import { TaskProgress } from '@app/scheduler-module'
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { CompanyAPIInput } from 'defs'
import { AUTHOR } from '../../../constants'
import { CompanyTermeneDataset } from '../../../schema/company'
import { CompanyScraperService } from '../../extractor'
import { CompanyDataTransformerService } from '../../transformer/services/companyDataTransformerService'
import { QUEUE_COMPANIES } from '../constants'
import { ProceedingProducerService } from '../proceedings/proceedingProducerService'
import { ProcessCompanyEvent } from '../types'

@Processor(QUEUE_COMPANIES)
export class CompanyProcessor extends WorkerHost {
  constructor(
    private readonly companyScraperService: CompanyScraperService,
    private readonly proceedingProducerService: ProceedingProducerService,
    private readonly companyTransformService: CompanyDataTransformerService,
    private readonly companyLoaderService: CompanyLoaderService,
  ) {
    super()
  }

  async process(job: Job<ProcessCompanyEvent>): Promise<void> {
    if (!job.progress) {
      await job.updateProgress({ stage: 'EXTRACT' } as TaskProgress)
    }

    const {
      data: { cui },
    } = job

    if ((job.progress as TaskProgress).stage === 'EXTRACT') {
      const companyScrapedData = await this.companyScraperService.extractCompanyData(cui)

      if (companyScrapedData) {
        await job.updateData({ ...job.data, dataset: companyScrapedData })
        await job.updateProgress({ stage: 'TRANSFORM' } as TaskProgress)
      }
    }

    if ((job.progress as TaskProgress).stage === 'TRANSFORM') {
      const {
        id,
        data: { dataset },
      } = job

      if (dataset) {
        const companyInfo = await this.transformCompany(cui, dataset, String(id))

        if (companyInfo) {
          await job.updateData({ ...job.data, companyInfo })
          await job.updateProgress({ stage: 'LOAD' } as TaskProgress)
        }
      }
    }

    if ((job.progress as TaskProgress).stage === 'LOAD') {
      const {
        data: { companyInfo },
      } = job

      if (companyInfo) {
        await this.loadCompany(cui, companyInfo)
      }
    }
  }

  private async transformCompany(cui: string, dataset: CompanyTermeneDataset, jobId: string) {
    const companyInfo = this.companyTransformService.transformCompanyData(cui, dataset)

    if (dataset.associates) {
      companyInfo.associates = await this.companyTransformService.transformAssociates(
        cui,
        dataset.associates,
        {
          queue: QUEUE_COMPANIES,
          id: jobId,
        },
      )
    }

    if (dataset.courtCases?.rezultatele_cautarii.length) {
      await this.proceedingProducerService.transformProceedings(
        dataset.courtCases.rezultatele_cautarii,
        {
          queue: QUEUE_COMPANIES,
          id: jobId,
        },
      )
    }
    return companyInfo
  }

  private async loadCompany(cui: string, companyInfo: CompanyAPIInput) {
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
