import { WorkerHost, Processor } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { PersonScraperService } from '../../extractor'
import { CompanyProducerService } from '../companies/companyProducerService'
import { QUEUE_PERSONS } from '../constants'
import { ProcessPersonEvent } from '../types'

@Processor(QUEUE_PERSONS)
export class PersonProcessor extends WorkerHost {
  constructor(
    private readonly personScraperService: PersonScraperService,
    private readonly companyProducerService: CompanyProducerService,
  ) {
    super()
  }

  async process(job: Job<ProcessPersonEvent>): Promise<void> {
    const {
      data: { personUrl },
    } = job

    const companies = await this.personScraperService.getPersonCompanies(personUrl)

    if (companies?.length) {
      await this.companyProducerService.importCompanies(
        companies.map(({ cui }) => cui),
        false,
        {
          queue: QUEUE_PERSONS,
          id: String(job.id),
        },
      )
    }
  }
}
