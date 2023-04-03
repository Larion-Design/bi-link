import { PersonIndex, PersonSearchIndex } from '@app/definitions'
import { Injectable, Logger } from '@nestjs/common'
import { SearchRequest, SearchTotalHits } from '@elastic/elasticsearch/lib/api/types'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_PERSONS } from '@app/definitions'
import { PersonListRecord, PersonsSuggestions } from 'defs'
import { SearchHelperService } from './searchHelperService'

@Injectable()
export class SearchPersonsService {
  private readonly index = INDEX_PERSONS
  private readonly logger = new Logger(SearchPersonsService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly searchHelperService: SearchHelperService,
  ) {}

  /**
   * todo: see https://stackoverflow.com/questions/68127892/how-does-search-after-work-in-elastic-search
   * todo: see https://stackoverflow.com/a/69878184/4837517
   */
  searchBasicSuggestions = async (
    searchTerm: string,
    skip: number,
    limit: number,
  ): Promise<PersonsSuggestions<PersonListRecord> | undefined> => {
    try {
      const request: SearchRequest = {
        index: this.index,
        from: skip,
        size: limit,
        fields: ['firstName', 'lastName', 'cnp'] as Array<keyof PersonSearchIndex>,
        sort: ['_score'],
        track_total_hits: true,
      }

      if (searchTerm.length) {
        request.query = {
          bool: {
            should: [
              ...this.searchHelperService.getTermQueries(searchTerm, ['_id', 'cnp']),
              this.searchHelperService.getMultisearchQuery<PersonIndex>(searchTerm, [
                'firstName',
                'lastName',
                'homeAddress',
              ]),
              this.searchHelperService.getMultisearchQuery(searchTerm, [
                'oldNames.name',
                'oldNames.changeReason',
              ]),
              this.searchHelperService.getCustomFieldsSearchQuery(searchTerm),
              this.searchHelperService.getCustomFieldsSearchQuery(searchTerm, 'contactDetails'),
              this.searchHelperService.getFilesSearchQuery(searchTerm),
              {
                nested: {
                  path: 'documents',
                  query: {
                    term: {
                      'documents.documentNumber': searchTerm,
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
      } = await this.elasticsearchService.search<PersonSearchIndex>(request)

      return {
        total: (total as SearchTotalHits).value,
        records: hits.map(({ _id, _source }) => this.transformRecord(_id, _source!)),
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  cnpExists = async (cnp: string, personId?: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search({
        index: this.index,
        _source: false,
        query: {
          term: {
            cnp,
          },
        },
      })
      return !!hits.map(({ _id }) => _id).filter((_id) => _id !== personId).length
    } catch (error) {
      this.logger.error(error)
    }
  }

  idDocumentExists = async (documentNumber: string, personId?: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search({
        index: this.index,
        _source: false,
        query: {
          nested: {
            path: 'documents',
            query: {
              term: {
                'documents.documentNumber': documentNumber,
              },
            },
          },
        },
      })
      return !!hits.map(({ _id }) => _id).filter((_id) => _id !== personId).length
    } catch (error) {
      this.logger.error(error)
    }
  }

  protected transformRecord = (_id: string, record: PersonSearchIndex) => ({
    _id,
    firstName: record.firstName,
    lastName: record.lastName,
    cnp: record.cnp,
  })
}
