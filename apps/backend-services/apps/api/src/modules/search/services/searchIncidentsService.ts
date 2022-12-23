import { Injectable, Logger } from '@nestjs/common'
import { INDEX_INCIDENTS } from '@app/definitions/constants'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchHelperService } from './searchHelperService'
import { SearchRequest, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'
import { IncidentIndex, IncidentListRecord, IncidentSearchIndex } from '@app/definitions/incident'
import { IncidentsSuggestions } from '../../api/incidents/dto/incidentsSuggestions'

@Injectable()
export class SearchIncidentsService {
  private readonly index = INDEX_INCIDENTS
  private readonly logger = new Logger(SearchIncidentsService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly searchHelperService: SearchHelperService,
  ) {}

  searchBasicSuggestions = async (searchTerm: string, skip: number, limit: number) => {
    try {
      const request: SearchRequest = {
        index: this.index,
        from: skip,
        size: limit,
        fields: ['date', 'location', 'type'] as Array<keyof IncidentSearchIndex>,
        sort: ['_score'],
        track_total_hits: true,
      }

      if (searchTerm.length) {
        request.query = {
          bool: {
            should: [
              ...this.searchHelperService.getTermQueries(searchTerm, ['_id', 'type']),
              this.searchHelperService.getMultisearchQuery<IncidentIndex>(searchTerm, [
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
      } = await this.elasticsearchService.search<IncidentSearchIndex>(request)

      const suggestions = new IncidentsSuggestions()
      suggestions.records = hits.map(({ _id, _source }) => this.transformRecord(_id, _source)) ?? []
      suggestions.total = (total as SearchTotalHits).value
      return suggestions
    } catch (error) {
      this.logger.error(error)
    }
  }

  protected transformRecord = (
    _id: string,
    { location, date, type }: IncidentSearchIndex,
  ): IncidentListRecord => ({
    _id,
    type,
    location,
    date: date ? new Date(date) : null,
  })
}
