import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'
import { Event } from '../dto/event'
import { EventsSuggestions } from '../dto/eventsSuggestions'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@Resolver(() => Event)
export class SearchEvents {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => EventsSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchEvents(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.indexerService.search(searchTerm.toLowerCase(), ['EVENT'], limit, skip)
  }
}
