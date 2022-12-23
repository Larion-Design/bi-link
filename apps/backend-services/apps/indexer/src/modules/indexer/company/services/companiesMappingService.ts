import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { MappingValidatorService } from '@app/search-mapping-tools/services/mapping/mappingValidatorService'
import { CompanyIndex } from '@app/definitions/company'
import { INDEX_COMPANIES } from '@app/definitions/constants'
import { CompaniesIndexerService } from './companiesIndexerService'
import { MappingHelperService } from '@app/search-mapping-tools/services/mapping/mappingHelperService'
import { MappingInterface } from '@app/search-mapping-tools'

@Injectable()
export class CompaniesMappingService implements MappingInterface<CompanyIndex> {
  private readonly index = INDEX_COMPANIES

  constructor(
    private readonly mappingHelperService: MappingHelperService,
    mappingValidatorService: MappingValidatorService,
    companiesIndexerService: CompaniesIndexerService,
  ) {
    void mappingValidatorService
      .initIndex(this.index, this.getMapping())
      .then((mappingWasUpdated) => {
        if (mappingWasUpdated) {
          void companiesIndexerService.indexAllCompanies()
        }
      })
  }

  getMapping = (): Record<string | keyof CompanyIndex, MappingProperty> => ({
    name: this.mappingHelperService.textField,
    cui: this.mappingHelperService.keywordField,
    registrationNumber: this.mappingHelperService.keywordField,
    headquarters: this.mappingHelperService.textField,
    locations: this.mappingHelperService.textField,
    files: this.mappingHelperService.files,
    contactDetails: this.mappingHelperService.customFields,
    associatedPersons: this.mappingHelperService.connectedPerson,
    associatedCompanies: this.mappingHelperService.connectedCompany,
    customFields: this.mappingHelperService.customFields,
  })
}
