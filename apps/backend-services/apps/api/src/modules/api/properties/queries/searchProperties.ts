import { Args, Query, Resolver } from '@nestjs/graphql'
import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'
import { PropertiesSuggestions } from '../dto/propertiesSuggestions'

@Resolver(() => PropertiesSuggestions)
export class SearchProperties {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => PropertiesSuggestions)
  async searchProperties(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.indexerService.search(searchTerm.toLowerCase(), ['PROPERTY'], skip, limit)
  }
}
