import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { PersonsSuggestions } from '../dto/personsSuggestions'
import { SearchPersonsService } from '../../../search/services/searchPersonsService'
import { SearchPaginationArgs } from '../../common/dto/searchPaginationArgs'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'

@Resolver(PersonsSuggestions)
export class SearchPersons {
  constructor(private readonly searchPersonsService: SearchPersonsService) {}

  @Query(() => PersonsSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchPersons(
    @CurrentUser() user,
    @Args() { searchTerm, skip, limit }: SearchPaginationArgs,
  ) {
    return this.searchPersonsService.searchBasicSuggestions(searchTerm.toLowerCase(), skip, limit)
  }
}
