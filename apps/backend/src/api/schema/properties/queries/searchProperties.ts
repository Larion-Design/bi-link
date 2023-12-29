import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchPropertiesService } from '@modules/search/services/search'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'
import { PropertiesSuggestions } from '../dto/propertiesSuggestions'

@Resolver(() => PropertiesSuggestions)
export class SearchProperties {
  constructor(private readonly indexerService: SearchPropertiesService) {}

  @Query(() => PropertiesSuggestions)
  async searchProperties(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.indexerService.searchBasicSuggestions(searchTerm.toLowerCase(), skip, limit)
  }
}
