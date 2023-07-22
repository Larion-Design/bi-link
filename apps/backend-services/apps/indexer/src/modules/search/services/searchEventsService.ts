import { EventIndex, EventSearchIndex } from '@app/definitions'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchRequest, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'
import { formatAddress } from 'tools'
import { INDEX_EVENTS } from '../../../constants'
import { EventListRecord, EventsSuggestions, LocationAPIOutput, locationSchema } from 'defs'
import { SearchHelperService } from './searchHelperService'

@Injectable()
export class SearchEventsService {
  private readonly index = INDEX_EVENTS
  private readonly logger = new Logger(SearchEventsService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly searchHelperService: SearchHelperService,
  ) {}

  searchBasicSuggestions = async (
    searchTerm: string,
    skip: number,
    limit: number,
  ): Promise<EventsSuggestions | undefined> => {
    try {
      const request: SearchRequest = {
        index: this.index,
        from: skip,
        size: limit,
        fields: ['date', 'location', 'type'] as Array<keyof EventSearchIndex>,
        sort: ['_score'],
        track_total_hits: true,
      }

      if (searchTerm.length) {
        request.query = {
          bool: {
            should: [
              ...this.searchHelperService.getTermQueries(searchTerm, ['_id', 'type']),
              this.searchHelperService.getMultisearchQuery<EventIndex>(searchTerm, [
                'description',
                'location',
              ]),
              this.searchHelperService.getCustomFieldsSearchQuery(searchTerm),
              this.searchHelperService.getFilesSearchQuery(searchTerm),
              this.searchHelperService.getConnectedPersonsQuery(searchTerm, 'persons'),
              this.searchHelperService.getConnectedPropertiesQuery(searchTerm, 'properties'),
              this.searchHelperService.getConnectedCompaniesQuery(searchTerm, 'companies'),
              {
                nested: {
                  path: 'parties',
                  query: {
                    match: {
                      description: searchTerm,
                    },
                  },
                },
              },
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
      } = await this.elasticsearchService.search<EventSearchIndex>(request)

      return {
        total: (total as SearchTotalHits).value,
        records: hits.map(({ _id, _source }) =>
          this.transformRecord(_id, _source as EventSearchIndex),
        ),
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  protected transformRecord = (
    _id: string,
    { location, date, type }: EventSearchIndex,
  ): EventListRecord => ({
    _id,
    type,
    location: location ? formatAddress(locationSchema.parse(location)) : null,
    date: date ? new Date(date) : null,
  })
}
