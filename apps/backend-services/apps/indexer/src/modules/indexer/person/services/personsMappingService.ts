import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'
import { MappingValidatorService } from '@app/search-mapping-tools/services/mapping/mappingValidatorService'
import { PersonIndex } from '@app/definitions/person'
import { INDEX_PERSONS } from '@app/definitions/constants'
import { PersonsIndexerService } from './personsIndexerService'
import { MappingHelperService } from '@app/search-mapping-tools/services/mapping/mappingHelperService'
import { MappingInterface } from '@app/search-mapping-tools'

@Injectable()
export class PersonsMappingService implements MappingInterface<PersonIndex> {
  private readonly index = INDEX_PERSONS

  constructor(
    private readonly mappingHelperService: MappingHelperService,
    mappingValidatorService: MappingValidatorService,
    personsIndexerService: PersonsIndexerService,
  ) {
    void mappingValidatorService
      .initIndex(this.index, this.getMapping())
      .then((mappingWasUpdated) => {
        if (mappingWasUpdated) {
          return personsIndexerService.indexAllPersons()
        }
      })
  }

  getMapping = (): Record<string | keyof PersonIndex, MappingProperty> => ({
    cnp: this.mappingHelperService.keywordField,
    firstName: this.mappingHelperService.textField,
    lastName: this.mappingHelperService.textField,
    oldName: this.mappingHelperService.textField,
    homeAddress: this.mappingHelperService.textField,
    documents: {
      type: 'nested',
      properties: {
        documentNumber: this.mappingHelperService.keywordField,
        status: this.mappingHelperService.keywordField,
        validity: this.mappingHelperService.dateRange,
      },
    },
    birthdate: this.mappingHelperService.date,
    files: this.mappingHelperService.files,
    contactDetails: this.mappingHelperService.customFields,
    customFields: this.mappingHelperService.customFields,
  })
}
