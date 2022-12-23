import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import {
  INDEX_COMPANIES,
  INDEX_INCIDENTS,
  INDEX_PERSONS,
  INDEX_PROPERTIES,
} from '@app/definitions/constants'

@Injectable()
export class SimilarEntitiesService {
  private readonly logger = new Logger(SimilarEntitiesService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  getSimilarPersons = async (personId: string) =>
    await this.getSimilarDocuments(personId, INDEX_PERSONS)
  getSimilarCompanies = async (companyId: string) =>
    this.getSimilarDocuments(companyId, INDEX_COMPANIES)
  getSimilarProperties = async (propertyId: string) =>
    this.getSimilarDocuments(propertyId, INDEX_PROPERTIES)
  getSimilarIncidents = async (incidentId: string) =>
    this.getSimilarDocuments(incidentId, INDEX_INCIDENTS)

  private getSimilarDocuments = async (_id: string, _index: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search({
        query: {
          more_like_this: {
            like: {
              _index,
              _id,
            },
          },
        },
      })
      return hits
    } catch (e) {
      this.logger.error(e)
    }
  }
}
