import { CompanySearchIndex } from '@modules/definitions';
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  SearchRequest,
  SearchTotalHits,
} from '@elastic/elasticsearch/lib/api/types';
import { INDEX_COMPANIES } from '../../constants';
import { CompaniesSuggestions } from 'defs';
import { SearchHelperService } from './searchHelperService';

@Injectable()
export class SearchCompaniesService {
  private readonly index = INDEX_COMPANIES;
  private readonly logger = new Logger(SearchCompaniesService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly searchHelperService: SearchHelperService,
  ) {}

  searchBasicSuggestions = async (
    searchTerm: string,
    skip: number,
    limit: number,
  ): Promise<CompaniesSuggestions | undefined> => {
    try {
      const request: SearchRequest = {
        index: this.index,
        from: skip,
        size: limit,
        fields: ['name', 'cui', 'registrationNumber'] as Array<
          keyof CompanySearchIndex
        >,
        sort: ['_score'],
        track_total_hits: true,
      };

      if (searchTerm.length) {
        request.query = {
          bool: {
            should: [
              ...this.searchHelperService.getTermQueries(searchTerm, [
                '_id',
                'registrationNumber',
                'cui',
              ]),
              this.searchHelperService.getMultisearchQuery(searchTerm, [
                'name',
                'headquarters',
                'locations',
              ]),
              this.searchHelperService.getCustomFieldsSearchQuery(searchTerm),
              this.searchHelperService.getCustomFieldsSearchQuery(
                searchTerm,
                'contactDetails',
              ),
              this.searchHelperService.getFilesSearchQuery(searchTerm),
              this.searchHelperService.getConnectedCompaniesQuery(
                searchTerm,
                'associatedCompanies',
              ),
              this.searchHelperService.getConnectedPersonsQuery(
                searchTerm,
                'associatedPersons',
              ),
            ],
          },
        };
      } else {
        request.query = {
          match_all: {},
        };
      }

      const {
        hits: { total, hits },
      } = await this.elasticsearchService.search<CompanySearchIndex>(request);

      return {
        total: (total as SearchTotalHits).value,
        records: hits.map(({ _id, _source }) =>
          this.transformRecord(_id, _source),
        ),
      };
    } catch (error) {
      this.logger.error(error);
    }
  };

  cuiExists = async (cui: string, companyId?: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search({
        index: this.index,
        _source: false,
        query: {
          term: { cui },
        },
      });
      return !!hits.map(({ _id }) => _id).filter((_id) => _id !== companyId)
        .length;
    } catch (error) {
      this.logger.error(error);
    }
  };

  registrationNumberExists = async (
    registrationNumber: string,
    companyId?: string,
  ) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search({
        index: this.index,
        _source: false,
        query: {
          term: {
            registrationNumber,
          },
        },
      });

      return !!hits.map(({ _id }) => _id).filter((_id) => _id !== companyId)
        .length;
    } catch (error) {
      this.logger.error(error);
    }
  };

  protected transformRecord = (_id: string, record: CompanySearchIndex) => ({
    _id,
    ...record,
  });
}
