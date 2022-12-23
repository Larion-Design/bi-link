import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchPaginationArgs } from '../../common/dto/searchPaginationArgs'
import { PropertiesSuggestions } from '../dto/propertiesSuggestions'
import { SearchPropertiesService } from '../../../search/services/searchPropertiesService'

@Resolver(() => PropertiesSuggestions)
export class SearchProperties {
  constructor(private readonly searchPropertiesService: SearchPropertiesService) {}

  @Query(() => PropertiesSuggestions)
  async searchProperties(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.searchPropertiesService.searchBasicSuggestions(searchTerm, skip, limit)
  }
}
