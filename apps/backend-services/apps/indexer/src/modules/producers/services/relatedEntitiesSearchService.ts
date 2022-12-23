import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_COMPANIES, INDEX_INCIDENTS, INDEX_PROPERTIES } from '@app/definitions/constants'
import { CompanyIndex } from '@app/definitions/company'
import { IncidentIndex } from '@app/definitions/incident'
import { PropertyIndex } from '@app/definitions/property'

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
    this.getRelatedEntities(INDEX_PROPERTIES, 'companyOwners' as keyof PropertyIndex, companyId)

  getIncidentsRelatedToProperty = async (propertyId: string) =>
    this.getRelatedEntities(INDEX_INCIDENTS, 'properties' as keyof IncidentIndex, propertyId)

  getIncidentsRelatedToPerson = async (personId: string) =>
    this.getRelatedEntities(INDEX_INCIDENTS, 'persons' as keyof IncidentIndex, personId)

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
