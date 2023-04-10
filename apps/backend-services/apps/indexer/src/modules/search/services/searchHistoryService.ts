import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_HISTORY } from '../../../constants'
import { ActivityEventIndex } from '@app/definitions/indexer/activityEvent'

@Injectable()
export class SearchHistoryService {
  private readonly index = INDEX_HISTORY
  private readonly logger = new Logger(SearchHistoryService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  getActivityEvents = async (
    searchTerm: string,
    skip: number,
    take: number,
  ): Promise<ActivityEventIndex[] | undefined> => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search<ActivityEventIndex>({
        index: this.index,
        from: skip,
        size: take,
        query: {
          match_all: {},
        },
      })
      return hits.map(({ _id, _source }) => this.transformRecord(_id, _source!))
    } catch (error) {
      this.logger.error(error)
    }
  }

  private transformRecord = (_id: string, eventInfo: ActivityEventIndex) => ({
    _id,
    ...eventInfo,
  })
}
