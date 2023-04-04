import { CompanyIndex, ConnectedCompanyIndex, ConnectedPersonIndex } from '@app/definitions'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_COMPANIES } from '@app/definitions'
import { Associate, Company } from 'defs'
import { ConnectedEntityIndexerService } from './connectedEntityIndexerService'
import { LocationIndexerService } from './locationIndexerService'

@Injectable()
export class CompaniesIndexerService {
  private readonly index = INDEX_COMPANIES
  private readonly logger = new Logger(CompaniesIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
    private readonly locationIndexerService: LocationIndexerService,
  ) {}

  indexCompany = async (companyId: string, companyModel: Company) => {
    try {
      const { _id } = await this.elasticsearchService.index<CompanyIndex>({
        index: this.index,
        id: companyId,
        document: this.createIndexData(companyModel),
        refresh: true,
      })

      return _id === companyId
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createIndexData = (company: Company): CompanyIndex => ({
    name: company.name.value,
    cui: company.cui.value,
    registrationNumber: company.registrationNumber.value,
    headquarters: company.headquarters
      ? this.locationIndexerService.createLocationIndexData(company.headquarters)
      : undefined,
    customFields: company.customFields,
    contactDetails: company.contactDetails,
    locations: this.locationIndexerService.createLocationsIndexData(company.locations),
    associatedPersons: this.createAssociatedPersonsIndex(company.associates),
    associatedCompanies: this.createAssociatedCompaniesIndex(company.associates),
    files: [],
  })

  private createAssociatedPersonsIndex = (associates: Associate[]): ConnectedPersonIndex[] =>
    associates
      .filter(({ person }) => !!person)
      .map(({ person }) => this.connectedEntityIndexerService.createConnectedPersonIndex(person!))

  private createAssociatedCompaniesIndex = (associates: Associate[]): ConnectedCompanyIndex[] =>
    associates
      .filter(({ company }) => !!company)
      .map(({ company }) =>
        this.connectedEntityIndexerService.createConnectedCompanyIndex(company as Company),
      )
}
