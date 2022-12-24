import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_PROPERTIES } from '@app/definitions/constants'
import {
  QueryDslQueryContainer,
  SearchRequest,
  SearchTotalHits,
} from '@elastic/elasticsearch/lib/api/types'
import { SearchHelperService } from './searchHelperService'
import { PropertiesSuggestions, PropertyIndex, PropertyListRecord, PropertySearchIndex } from 'defs'

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
  ): Promise<PropertiesSuggestions> => {
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
      } = await this.elasticsearchService.search({
        index: this.index,
        _source: false,
        query: {
          nested: {
            path: 'associatedPersons',
            query: {
              term: {
                'companyOwners._id': companyId,
              },
            },
          },
        },
      })
      return hits.map(({ _id }) => _id)
    } catch (error) {
      this.logger.error(error)
    }
  }

  vinExists = async (vin: string, vehicleId?: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search({
        index: this.index,
        _source: false,
        query: {
          term: { vin },
        },
      })
      return !!hits.map(({ _id }) => _id).filter((_id) => _id !== vehicleId).length
    } catch (error) {
      this.logger.error(error)
    }
  }

  getPropertiesByPerson = async (personId: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search({
        index: this.index,
        _source: false,
        query: {
          nested: {
            path: 'personOwners',
            query: {
              term: {
                'personOwners._id': personId,
              },
            },
          },
        },
      })
      return hits.map(({ _id }) => _id)
    } catch (error) {
      this.logger.error(error)
    }
  }

  getMakers = async (model?: string): Promise<string[]> => {
    try {
      const query: QueryDslQueryContainer = model
        ? { bool: { filter: { term: { model } } } }
        : { match_all: {} }

      const { aggregations } = await this.elasticsearchService.search<
        unknown,
        Record<'makers', { buckets: { key: string; doc_count: number }[] }>
      >({
        index: this.index,
        _source: false,
        query,
        aggs: {
          makers: {
            terms: {
              field: 'maker',
            },
          },
        },
      })
      return aggregations?.makers?.buckets?.map(({ key }) => key).sort() ?? []
    } catch (error) {
      this.logger.error(error)
    }
  }

  getModels = async (maker?: string): Promise<string[]> => {
    try {
      const query: QueryDslQueryContainer = maker
        ? { bool: { filter: { term: { maker } } } }
        : { match_all: {} }

      const { aggregations } = await this.elasticsearchService.search<
        unknown,
        Record<'models', { buckets: { key: string; doc_count: number }[] }>
      >({
        index: this.index,
        _source: false,
        query,
        aggs: {
          models: {
            terms: {
              field: 'model',
            },
          },
        },
      })
      return aggregations?.models?.buckets?.map(({ key }) => key).sort() ?? []
    } catch (error) {
      this.logger.error(error)
    }
  }

  protected transformRecord = (_id: string, record: PropertySearchIndex): PropertyListRecord => ({
    _id,
    ...record,
  })
}
