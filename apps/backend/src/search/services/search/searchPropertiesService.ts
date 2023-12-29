import { PropertyIndex, PropertySearchIndex } from '@modules/definitions'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_PROPERTIES } from '../../constants'
import { SearchRequest, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'
import { SearchHelperService } from './searchHelperService'
import { PropertiesSuggestions, PropertyListRecord } from 'defs'

@Injectable()
export class SearchPropertiesService {
  private readonly index = INDEX_PROPERTIES
  private readonly logger = new Logger(SearchPropertiesService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly searchHelperService: SearchHelperService,
  ) {}

  searchBasicSuggestions = async (
    searchTerm: string,
    skip: number,
    limit: number,
  ): Promise<PropertiesSuggestions | undefined> => {
    try {
      const request: SearchRequest = {
        index: this.index,
        from: skip,
        size: limit,
        fields: ['name', 'type'] as Array<keyof PropertyIndex>,
        sort: ['_score'],
        track_total_hits: true,
      }

      if (searchTerm.length) {
        request.query = {
          bool: {
            should: [
              ...this.searchHelperService.getTermQueries(searchTerm, ['_id']),
              ...this.searchHelperService.getTermQueries(searchTerm, ['name', 'type'], true),
              this.searchHelperService.getCustomFieldsSearchQuery(searchTerm),
              this.searchHelperService.getFilesSearchQuery(searchTerm),
              this.searchHelperService.getConnectedCompaniesQuery(searchTerm, 'companiesOwners'),
              this.searchHelperService.getConnectedPersonsQuery(searchTerm, 'personsOwners'),
            ],
          },
        }
      } else {
        request.query = {
          match_all: {},
        }
      }

      const {
        hits: { total, hits },
      } = await this.elasticsearchService.search<PropertySearchIndex>(request)

      return {
        records: hits.map(({ _id, _source }) => this.transformRecord(_id, _source)) ?? [],
        total: (total as SearchTotalHits).value,
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  getPropertiesByCompany = async (companyId: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search<PropertySearchIndex>({
        index: this.index,
        fields: ['name', 'type'] as Array<keyof PropertyIndex>,
        query: {
          nested: {
            path: 'companiesOwners' as keyof PropertyIndex,
            query: {
              term: {
                'companyOwners._id': companyId,
              },
            },
          },
        },
      })
      return hits.map(({ _id, _source }) => this.transformRecord(_id, _source)) ?? []
    } catch (error) {
      this.logger.error(error)
    }
  }

  getPropertiesByPerson = async (personId: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search<PropertySearchIndex>({
        index: this.index,
        fields: ['name', 'type'] as Array<keyof PropertyIndex>,
        query: {
          nested: {
            path: 'personsOwners' as keyof PropertyIndex,
            query: {
              term: {
                'personOwners._id': personId,
              },
            },
          },
        },
      })
      return hits.map(({ _id, _source }) => this.transformRecord(_id, _source)) ?? []
    } catch (error) {
      this.logger.error(error)
    }
  }

  protected transformRecord = (_id: string, record: PropertySearchIndex): PropertyListRecord => ({
    _id,
    ...record,
  })
}
