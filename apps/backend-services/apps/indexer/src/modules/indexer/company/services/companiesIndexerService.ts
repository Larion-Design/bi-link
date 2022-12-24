import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { CompanyModel } from '@app/entities/models/companyModel'
import { LocationModel } from '@app/entities/models/locationModel'
import { AssociateModel } from '@app/entities/models/associateModel'
import { INDEX_COMPANIES } from '@app/definitions/constants'
import { CompanyIndex, ConnectedCompanyIndex, ConnectedPersonIndex } from 'defs'
import { CompanyEventDispatcherService } from '../../../producers/services/companyEventDispatcherService'
import { CompaniesService } from '@app/entities/services/companiesService'
import { ConnectedEntityIndexerService } from '../../shared/services/connectedEntityIndexerService'

@Injectable()
export class CompaniesIndexerService {
  private readonly index = INDEX_COMPANIES
  private readonly logger = new Logger(CompaniesIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly companiesService: CompaniesService,
    private readonly companyEventDispatcherService: CompanyEventDispatcherService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
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

  indexAllCompanies = async () => {
    const companiesIds: string[] = []

    for await (const { _id } of this.companiesService.getAllCompanies()) {
      companiesIds.push(String(_id))
    }

    if (companiesIds.length) {
      await this.companyEventDispatcherService.dispatchCompaniesUpdated(companiesIds)
    }
  }

  private createIndexData = (company: CompanyModel): CompanyIndex => ({
    name: company.name,
    cui: company.cui,
    registrationNumber: company.registrationNumber,
    headquarters: company.headquarters,
    customFields: company.customFields,
    contactDetails: company.contactDetails,
    locations: this.createLocationsIndexData(company.locations),
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

  private createLocationsIndexData = (locations: LocationModel[]) =>
    locations.filter(({ isActive }) => isActive).map(({ address }) => address)
}
