import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { Cache } from 'cache-manager'

@Injectable()
export class FrequentCustomFieldsService {
  private readonly logger = new Logger(FrequentCustomFieldsService.name)

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  getFrequentlyCustomFields = async (index: string, limit = 5): Promise<string[]> => {
    try {
      let frequentFields = await this.getCachedCustomFields(index)

      if (!frequentFields) {
        frequentFields = await this.computeFrequentInfoFields(index)
        await this.cacheFrequentCustomFields(index, frequentFields)
      }
      return frequentFields?.slice(0, limit) ?? []
    } catch (error) {
      this.logger.error(error)
    }
  }

  private getCachedCustomFields = async (index: string) => {
    try {
      return this.cacheManager.get<string[]>(this.getCacheKey(index))
    } catch (e) {
      this.logger.error(e)
    }
  }

  private cacheFrequentCustomFields = async (index: string, fields: string[]) => {
    try {
      await this.cacheManager.set<string[]>(this.getCacheKey(index), fields, { ttl: 3600000 })
    } catch (e) {
      this.logger.error(e)
    }
  }

  private computeFrequentInfoFields = async (index: string) => {
    try {
      const { aggregations } = await this.elasticsearchService.search<
        unknown,
        Record<
          string,
          {
            fieldName: { buckets: { key: string; doc_count: number }[] }
          }
        >
      >({
        index,
        _source: false,
        query: {
          match_all: {},
        },
        aggs: {
          freqCustomFieldsNames: {
            nested: {
              path: 'customFields',
            },
            aggs: {
              fieldName: {
                terms: {
                  field: 'customFields.fieldName',
                },
              },
            },
          },
        },
      })

      return aggregations?.freqCustomFieldsNames?.fieldName?.buckets?.map(({ key }) => key).sort()
    } catch (e) {
      this.logger.error(e)
    }
  }

  private getCacheKey = (index: string) => `${index}.frequentInfoFields`
}
