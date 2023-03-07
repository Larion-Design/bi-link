import { CompanyIndex, ConnectedCompanyIndex, ConnectedPersonIndex } from '@app/definitions'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { CompanyModel } from '@app/models'
import { AssociateModel } from '@app/models'
import { INDEX_COMPANIES } from '@app/definitions'
import { CompaniesService } from '@app/models'
import { ConnectedEntityIndexerService } from './connectedEntityIndexerService'
import { LocationIndexerService } from './locationIndexerService'

@Injectable()
export class CompaniesIndexerService {
  private readonly index = INDEX_COMPANIES
  private readonly logger = new Logger(CompaniesIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly companiesService: CompaniesService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
    private readonly locationIndexerService: LocationIndexerService,
  ) {}

  indexCompany = async (companyId: string, companyModel: CompanyModel) => {
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

  private createIndexData = (company: CompanyModel): CompanyIndex => ({
    name: company.name,
    cui: company.cui,
    registrationNumber: company.registrationNumber,
    headquarters: company.headquarters
      ? this.locationIndexerService.createLocationIndexData(company.headquarters)
      : null,
    customFields: company.customFields,
    contactDetails: company.contactDetails,
    locations: this.locationIndexerService.createLocationsIndexData(company.locations),
    associatedPersons: this.createAssociatedPersonsIndex(company.associates),
    associatedCompanies: this.createAssociatedCompaniesIndex(company.associates),
    files: [],
  })

  private createAssociatedPersonsIndex = (associates: AssociateModel[]): ConnectedPersonIndex[] =>
    associates
      .filter(({ person }) => !!person)
      .map(({ person }) => this.connectedEntityIndexerService.createConnectedPersonIndex(person))

  private createAssociatedCompaniesIndex = (
    associates: AssociateModel[],
  ): ConnectedCompanyIndex[] =>
    associates
      .filter(({ company }) => !!company)
      .map(({ company }) => this.connectedEntityIndexerService.createConnectedCompanyIndex(company))
}
