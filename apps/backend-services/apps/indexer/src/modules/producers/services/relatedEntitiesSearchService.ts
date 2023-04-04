import {
  CompanyIndex,
  EventIndex,
  PropertyIndex,
  INDEX_COMPANIES,
  INDEX_EVENTS,
  INDEX_PROPERTIES,
  ConnectedCompanyIndex,
  ConnectedPropertyIndex,
} from '@app/definitions'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'

@Injectable()
export class RelatedEntitiesSearchService {
  private readonly logger = new Logger(RelatedEntitiesSearchService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  getCompaniesRelatedToPerson = async (personId: string) =>
    this.getRelatedEntities(INDEX_COMPANIES, 'associatedPersons' as keyof CompanyIndex, personId)

  getCompaniesRelatedToCompany = async (companyId: string) =>
    this.getRelatedEntities(INDEX_COMPANIES, 'associatedCompanies' as keyof CompanyIndex, companyId)

  getPropertiesRelatedToPerson = async (personId: string) =>
    this.getRelatedEntities(INDEX_PROPERTIES, 'personOwners' as keyof PropertyIndex, personId)

  getPropertiesRelatedToCompany = async (companyId: string) =>
    this.getRelatedEntities(
      INDEX_PROPERTIES,
      'companyOwners' as keyof ConnectedCompanyIndex,
      companyId,
    )

  getEventsRelatedToProperty = async (propertyId: string) =>
    this.getRelatedEntities(INDEX_EVENTS, 'properties' as keyof ConnectedPropertyIndex, propertyId)

  getEventsRelatedToPerson = async (personId: string) =>
    this.getRelatedEntities(INDEX_EVENTS, 'persons' as keyof EventIndex, personId)

  private getRelatedEntities = async (index: string, path: string, entityId: string) => {
    try {
      const {
        hits: { hits },
      } = await this.elasticsearchService.search({
        index: index,
        _source: false,
        query: {
          nested: {
            path,
            query: {
              term: {
                [`${path}._id`]: entityId,
              },
            },
          },
        },
      })
      return hits.map(({ _id }) => _id)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
