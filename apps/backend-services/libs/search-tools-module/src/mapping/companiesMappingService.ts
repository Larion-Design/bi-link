import { CompanyIndex } from '@app/definitions/search/company'
import { MappingInterface } from '@app/search-tools-module/mapping/mapping'
import { MappingHelperService } from '@app/search-tools-module/mapping/mappingHelperService'
import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class CompaniesMappingService implements MappingInterface<CompanyIndex> {
  constructor(private readonly mappingHelperService: MappingHelperService) {}

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