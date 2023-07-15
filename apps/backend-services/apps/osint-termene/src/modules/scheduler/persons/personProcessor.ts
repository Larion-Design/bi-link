import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { AssociateDatasetScraperService } from '../../extractor'
import { CompanyProducerService } from '../companies/companyProducerService'
import { EVENT_IMPORT, QUEUE_PERSONS } from '../constants'
import { ExtractPersonEvent } from '../types'

@Processor(QUEUE_PERSONS)
export class PersonProcessor {
  constructor(
    private readonly associateDatasetScraperService: AssociateDatasetScraperService,
    private readonly companyProducerService: CompanyProducerService,
  ) {}

  @Process(EVENT_IMPORT)
  async extractPersonCompanies(job: Job<ExtractPersonEvent>) {
    try {
      const {
        data: { personUrl },
      } = job

      const companies = await this.associateDatasetScraperService.getCompaniesByAssociateUrl(
        personUrl,
      )

      if (companies.length) {
        await this.companyProducerService.importCompanies(companies.map(({ cui }) => cui))
      }
      return true
    } catch (e) {
      return job.moveToFailed(e as { message: string })
    }
  }
}
