import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MICROSERVICES } from '@app/rpc'
import { IndexerServiceMethods } from '@app/rpc/microservices/indexer/indexerServiceConfig'
import {
  SearchCompaniesService,
  SearchEventsService,
  SearchPersonsService,
  SearchProceedingsService,
  SearchPropertiesService,
} from '../search/services'

@Controller()
export class SearchController {
  constructor(
    private readonly searchPersonsService: SearchPersonsService,
    private readonly searchCompaniesService: SearchCompaniesService,
    private readonly searchPropertiesService: SearchPropertiesService,
    private readonly searchEventsService: SearchEventsService,
    private readonly searchProceedingsService: SearchProceedingsService,
  ) {}

  @MessagePattern(MICROSERVICES.INDEXER.search)
  async search(
    @Payload()
    { entityType, searchTerm, limit, skip }: Parameters<IndexerServiceMethods['search']>[0],
  ) {
    switch (entityType) {
      case 'PERSON': {
        return this.searchPersonsService.searchBasicSuggestions(searchTerm, skip, limit)
      }
      case 'COMPANY': {
        return this.searchCompaniesService.searchBasicSuggestions(searchTerm, skip, limit)
      }
      case 'PROPERTY': {
        return this.searchPropertiesService.searchBasicSuggestions(searchTerm, skip, limit)
      }
      case 'EVENT': {
        return this.searchEventsService.searchBasicSuggestions(searchTerm, skip, limit)
      }
      case 'PROCEEDING': {
        return this.searchProceedingsService.searchProceedings(searchTerm, skip, limit)
      }
    }
  }
}
