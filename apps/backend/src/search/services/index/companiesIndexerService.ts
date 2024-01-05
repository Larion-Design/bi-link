import {
  CompanyIndex,
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  BalanceSheetIndex,
} from '@modules/definitions'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { Associate, BalanceSheet, Company, companySchema } from 'defs'
import { INDEX_COMPANIES } from '../../constants'
import { ConnectedEntityIndexerService } from './connectedEntityIndexerService'
import { CustomFieldsIndexerService } from './customFieldsIndexerService'
import { LocationIndexerService } from './locationIndexerService'

@Injectable()
export class CompaniesIndexerService {
  private readonly index = INDEX_COMPANIES
  private readonly logger = new Logger(CompaniesIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
    private readonly locationIndexerService: LocationIndexerService,
    private readonly customFieldsIndexerService: CustomFieldsIndexerService,
  ) {}

  async indexCompany(companyId: string, companyModel: Company) {
    await this.elasticsearchService.index<CompanyIndex>({
      index: this.index,
      id: companyId,
      document: this.createIndexData(companyModel),
      refresh: true,
    })

    return true
  }

  private createIndexData = (company: Company): CompanyIndex => ({
    name: company.name.value,
    cui: company.cui.value,
    registrationNumber: company.registrationNumber.value,
    headquarters: company.headquarters
      ? this.locationIndexerService.createLocationIndexData(company.headquarters)
      : undefined,
    customFields: company.customFields
      ? this.customFieldsIndexerService.createCustomFieldsIndex(company.customFields)
      : [],
    contactDetails: company.contactDetails
      ? this.customFieldsIndexerService.createCustomFieldsIndex(company.contactDetails)
      : [],
    locations: this.locationIndexerService.createLocationsIndexData(company.locations),
    associatedPersons: this.createAssociatedPersonsIndex(company.associates),
    associatedCompanies: this.createAssociatedCompaniesIndex(company.associates),
    files: [],
    balanceSheets: this.createBalanceSheetIndex(company.balanceSheets),
    activityCodes: company.activityCodes
      ? this.customFieldsIndexerService.createCustomFieldsIndex(company.activityCodes)
      : [],
  })

  private createAssociatedPersonsIndex(associates: Associate[]) {
    const persons: ConnectedPersonIndex[] = []
    associates.forEach(({ person }) => {
      if (person) {
        persons.push(this.connectedEntityIndexerService.createConnectedPersonIndex(person))
      }
    })
    return persons
  }

  private createAssociatedCompaniesIndex = (associates: Associate[]) => {
    const companies: ConnectedCompanyIndex[] = []
    associates.forEach(({ company }) => {
      if (company) {
        const companyInfo = companySchema.parse(company)
        companies.push(this.connectedEntityIndexerService.createConnectedCompanyIndex(companyInfo))
      }
    })
    return companies
  }

  private createBalanceSheetIndex = (balanceSheets: BalanceSheet[]): BalanceSheetIndex[] =>
    balanceSheets
}
