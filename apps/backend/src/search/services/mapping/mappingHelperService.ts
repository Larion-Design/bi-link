import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedProceedingIndex,
  ConnectedPropertyIndex,
} from '@modules/definitions'
import { Injectable } from '@nestjs/common'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class MappingHelperService {
  readonly romanianTextProperty: MappingProperty = {
    type: 'text',
    analyzer: 'romanian',
    search_analyzer: 'romanian',
    index_options: 'docs',
    term_vector: 'yes',
  }

  readonly integerField: MappingProperty = { type: 'integer' }

  readonly keywordField: MappingProperty = { type: 'keyword' }

  readonly textField: MappingProperty = {
    type: 'text',
    index_options: 'docs',
    term_vector: 'yes',
  }

  nestedField = <T>(properties: Record<keyof T | string, MappingProperty>) => ({
    type: 'nested',
    properties,
  })

  readonly date: MappingProperty = {
    type: 'date',
    format: 'yyyy-mm-dd',
  }

  readonly dateTime: MappingProperty = {
    type: 'date',
    format: 'yyyy-MM-dd HH:mm:ss',
  }

  readonly year: MappingProperty = {
    type: 'date',
    format: 'yyyy',
  }

  readonly timestamp: MappingProperty = {
    type: 'date',
    format: 'epoch_second',
  }

  readonly dateRange: MappingProperty = {
    type: 'date_range',
    format: 'yyyy-mm-dd',
  }

  readonly yearRange: MappingProperty = {
    type: 'date_range',
    format: 'yyyy',
  }

  readonly geoPoint: MappingProperty = {
    type: 'geo_point',
  }

  readonly customFields: MappingProperty = {
    type: 'nested',
    properties: {
      fieldName: this.keywordField,
      fieldValue: this.romanianTextProperty,
    },
  }

  readonly files: MappingProperty = {
    type: 'nested',
    properties: {
      name: this.romanianTextProperty,
      description: this.romanianTextProperty,
      content: this.romanianTextProperty,
    },
  }

  readonly location: MappingProperty = {
    type: 'nested',
    properties: {
      street: this.textField,
      number: this.textField,
      building: this.textField,
      door: this.textField,
      zipCode: this.textField,
      locality: this.textField,
      county: this.textField,
      country: this.textField,
      otherInfo: this.textField,
      coordinates: this.geoPoint,
    },
  }

  readonly connectedPerson: MappingProperty = {
    type: 'nested',
    properties: {
      _id: this.keywordField,
      firstName: this.textField,
      lastName: this.textField,
      oldName: this.textField,
      cnp: this.keywordField,
      documents: this.keywordField,
    } as Record<string | keyof ConnectedPersonIndex, MappingProperty>,
  }

  readonly connectedCompany: MappingProperty = {
    type: 'nested',
    properties: {
      _id: this.keywordField,
      name: this.textField,
      cui: this.keywordField,
      registrationNumber: this.keywordField,
      customFields: this.customFields,
    } as Record<string | keyof ConnectedCompanyIndex, MappingProperty>,
  }

  readonly connectedProperty: MappingProperty = {
    type: 'nested',
    properties: {
      _id: this.keywordField,
      name: this.keywordField,
      type: this.keywordField,
      vehicleInfo: {
        type: 'nested',
        properties: {
          vin: this.keywordField,
          maker: this.keywordField,
          model: this.keywordField,
          color: this.keywordField,
          plateNumbers: this.keywordField,
        },
      },
      realEstateInfo: {
        type: 'nested',
        properties: {
          surface: this.textField,
          location: this.location,
        },
      },
    } as Record<keyof ConnectedPropertyIndex, MappingProperty>,
  }

  readonly connectedProceeding: MappingProperty = {
    type: 'nested',
    properties: {
      _id: this.keywordField,
      name: this.romanianTextProperty,
      description: this.romanianTextProperty,
      type: this.keywordField,
      year: this.year,
      status: this.keywordField,
      fileNumber: this.keywordField,
    } as Record<keyof ConnectedProceedingIndex, MappingProperty>,
  }
}
