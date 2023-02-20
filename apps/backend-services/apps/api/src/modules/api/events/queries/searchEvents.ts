import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchPaginationArgs } from '../../common/dto/searchPaginationArgs'
import { Event } from '../dto/event'
import { EventsSuggestions } from '../dto/eventsSuggestions'
import { SearchEventsService } from '../../../search/services/searchEventsService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@Resolver(() => Event)
export class SearchEvents {
  constructor(private readonly searchEventsService: SearchEventsService) {}

  @Query(() => EventsSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchEvents(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.searchEventsService.searchBasicSuggestions(searchTerm.toLowerCase(), skip, limit)
  }
}
