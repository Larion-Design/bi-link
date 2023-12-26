import { Injectable } from '@nestjs/common'
import { AssociateScraperService } from './associateScraperService'

@Injectable()
export class PersonScraperService {
  constructor(private readonly associateDatasetScraperService: AssociateScraperService) {}

  async getPersonCompanies(personUrl: string) {
    return this.associateDatasetScraperService.getCompaniesByAssociateUrl(personUrl)
  }
}
