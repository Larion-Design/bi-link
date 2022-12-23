import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_PROPERTIES } from '@app/definitions/constants'
import {
  QueryDslQueryContainer,
  SearchRequest,
  SearchTotalHits,
} from '@elastic/elasticsearch/lib/api/types'
import { SearchHelperService } from './searchHelperService'
import {
  PropertiesSuggestions,
  PropertyListRecord,
  PropertySearchIndex,
} from '@app/definitions/property'

@Injectable()
export class SearchVehiclesService {
  private readonly index = INDEX_PROPERTIES
  private readonly logger = new Logger(SearchVehiclesService.name)

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
        fields: ['vehicleInfo.vin', 'vehicleInfo.maker', 'vehicleInfo.model'],
        sort: ['_score'],
        track_total_hits: true,
      }

      if (searchTerm.length) {
        request.query = {
          bool: {
            should: [
              ...this.searchHelperService.getTermQueries(searchTerm, ['_id']),
              ...this.searchHelperService.getTermQueries(
                searchTerm,
                [
                  'vehicleInfo.vin',
                  'vehicleInfo.maker',
                  'vehicleInfo.model',
                  'vehicleInfo.plateNumbers',
                ],
                true,
              ),
              this.searchHelperService.getFuzzySearchQuery('vehicleInfo.color', searchTerm),
              this.searchHelperService.getCustomFieldsSearchQuery(searchTerm),
              this.searchHelperService.getFilesSearchQuery(searchTerm),
              this.searchHelperService.getConnectedCompaniesQuery(searchTerm, 'companyOwners'),
              this.searchHelperService.getConnectedPersonsQuery(searchTerm, 'personOwners'),
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

  vinExists = async (vin: string, propertyId?: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search({
        index: this.index,
        _source: false,
        query: {
          term: { 'vehicleInfo.vin': vin },
        },
      })
      return !!hits.map(({ _id }) => _id).filter((_id) => _id !== propertyId).length
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
              field: 'vehicleInfo.maker',
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
              field: 'vehicleInfo.model',
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
