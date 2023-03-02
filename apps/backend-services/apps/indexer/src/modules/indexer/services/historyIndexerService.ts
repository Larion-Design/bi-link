import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_HISTORY } from '@app/definitions/constants'
import { ActivityEventIndex } from 'defs'

@Injectable()
export class HistoryIndexerService {
  private readonly index = INDEX_HISTORY
  private readonly logger = new Logger(HistoryIndexerService.name)

  constructor(private elasticsearchService: ElasticsearchService) {}

  indexEvent = async (eventInfo: ActivityEventIndex) => {
    try {
      const { result } = await this.elasticsearchService.index<ActivityEventIndex>({
        index: this.index,
        document: eventInfo,
        refresh: 'wait_for',
      })
      if (result === 'created') {
        this.logger.debug(`Recorded ${eventInfo.eventType} action performed by ${eventInfo.author}`)
      }
    } catch (error) {
      this.logger.error(error)
    }
  }
}
