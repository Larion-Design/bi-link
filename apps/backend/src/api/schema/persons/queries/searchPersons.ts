import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '@modules/iam'
import { SearchPersonsService } from '@modules/search/services/search'
import { PersonsSuggestions } from '../dto/personsSuggestions'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'

@Resolver(PersonsSuggestions)
export class SearchPersons {
  constructor(private readonly indexerService: SearchPersonsService) {}

  @Query(() => PersonsSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchPersons(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.indexerService.searchBasicSuggestions(searchTerm.toLowerCase(), skip, limit)
  }
}
