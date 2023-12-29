import { Args, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '@modules/iam'
import { SearchEventsService } from '@modules/search/services/search'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'
import { Event } from '../dto/event'
import { EventsSuggestions } from '../dto/eventsSuggestions'
import { UseGuards } from '@nestjs/common'

@Resolver(() => Event)
export class SearchEvents {
  constructor(private readonly indexerService: SearchEventsService) {}

  @Query(() => EventsSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchEvents(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.indexerService.searchBasicSuggestions(searchTerm.toLowerCase(), skip, limit)
  }
}
