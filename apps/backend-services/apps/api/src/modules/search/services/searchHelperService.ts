import { Injectable } from '@nestjs/common'
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class SearchHelperService {
  getFilesSearchQuery = (searchTerm: string, path = 'files'): QueryDslQueryContainer => ({
    nested: {
      path,
      query: {
        multi_match: {
          fields: [`${path}.name`, `${path}.description`, `${path}.content`],
          query: searchTerm,
          operator: 'and',
          type: 'cross_fields',
        },
      },
    },
  })

  getCustomFieldsSearchQuery = (
    searchTerm: string,
    path = 'customFields',
  ): QueryDslQueryContainer => ({
    nested: {
      path,
      query: this.getFuzzySearchQuery(`${path}.fieldValue`, searchTerm),
    },
  })

  getConnectedPersonsQuery = (searchTerm: string, path: string): QueryDslQueryContainer => ({
    nested: {
      path,
      query: {
        multi_match: {
          fields: [
            `${path}._id`,
            `${path}.firstName`,
            `${path}.lastName`,
            `${path}.cnp`,
            `${path}.documents`,
          ],
          query: searchTerm,
          operator: 'and',
          type: 'cross_fields',
        },
      },
    },
  })

  getConnectedCompaniesQuery = (searchTerm: string, path: string): QueryDslQueryContainer => ({
    nested: {
      path,
      query: {
        multi_match: {
          fields: [`${path}._id`, `${path}.name`, `${path}.cui`, `${path}.registrationNumber`],
          query: searchTerm,
          operator: 'and',
          type: 'cross_fields',
        },
      },
    },
  })

  getConnectedPropertiesQuery = (searchTerm: string, path: string): QueryDslQueryContainer => ({
    nested: {
      path,
      query: {
        multi_match: {
          fields: [
            `${path}._id`,
            `${path}.type`,
            `${path}.vehicleInfo.vin`,
            `${path}.vehicleInfo.model`,
            `${path}.vehicleInfo.maker`,
            `${path}.vehicleInfo.color`,
            `${path}.vehicleInfo.plateNumbers`,
          ],
          query: searchTerm,
          operator: 'and',
          type: 'cross_fields',
        },
      },
    },
  })

  getMultisearchQuery = <T>(
    searchTerm: string,
    fields: Array<keyof T>,
  ): QueryDslQueryContainer => ({
    multi_match: {
      query: searchTerm,
      fields: fields as string[],
      operator: 'and',
      type: 'cross_fields',
    },
  })

  getTermQueries = (
    searchTerm: string,
    fields: string[],
    caseInsensitive = false,
  ): QueryDslQueryContainer[] =>
    fields.map((field) => ({
      term: { [field]: { value: searchTerm, case_insensitive: caseInsensitive } },
    }))

  getFuzzySearchQuery = (field: string, searchTerm: string): QueryDslQueryContainer => ({
    fuzzy: {
      [field]: {
        value: searchTerm,
        fuzziness: 'AUTO',
        prefix_length: 3,
      },
    },
  })
}
