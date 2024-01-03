import { PropertySearchIndex } from '@modules/definitions'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_PROPERTIES } from '../../constants'
import { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types'
import { PropertyListRecord } from 'defs'

@Injectable()
export class SearchVehiclesService {
  private readonly index = INDEX_PROPERTIES
  private readonly logger = new Logger(SearchVehiclesService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

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

  getMakers = async (model?: string): Promise<string[] | undefined> => {
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

  getModels = async (maker?: string): Promise<string[] | undefined> => {
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
