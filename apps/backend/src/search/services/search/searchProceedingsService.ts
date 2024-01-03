import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { ProceedingIndex } from '@modules/definitions'
import { SearchRequest, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'
import { ProceedingSuggestions } from 'defs'
import { INDEX_PROCEEDINGS } from '../../constants'
import { SearchHelperService } from './searchHelperService'

@Injectable()
export class SearchProceedingsService {
  private readonly logger = new Logger(SearchProceedingsService.name)
  private readonly index = INDEX_PROCEEDINGS

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly searchHelperService: SearchHelperService,
  ) {}

  searchProceedings = async (
    searchTerm: string,
    skip: number,
    limit: number,
  ): Promise<ProceedingSuggestions | undefined> => {
    try {
      const request: SearchRequest = {
        index: this.index,
        from: skip,
        size: limit,
        fields: ['name', 'fileNumber', 'type', 'year'] as Array<keyof ProceedingIndex>,
        sort: ['_score'],
        track_total_hits: true,
      }

      if (searchTerm.length) {
        request.query = {
          bool: {
            should: [
              ...this.searchHelperService.getTermQueries(searchTerm, ['_id', 'fileNumber', 'year']),
              this.searchHelperService.getMultisearchQuery<ProceedingIndex>(searchTerm, [
                'name',
                'description',
              ]),
              this.searchHelperService.getCustomFieldsSearchQuery(searchTerm),
              this.searchHelperService.getFilesSearchQuery(searchTerm),
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
      } = await this.elasticsearchService.search<ProceedingIndex>(request)

      return {
        total: (total as SearchTotalHits).value,
        records: hits.map(({ _id, _source }) => this.transformRecord(_id, _source!)),
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  protected transformRecord = (
    _id: string,
    { name, fileNumber, type, year, status }: ProceedingIndex,
  ) => ({
    _id,
    name,
    year,
    fileNumber,
    type,
    status,
  })
}
