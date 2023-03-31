import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { PersonsSuggestions } from '../dto/personsSuggestions'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'

@Resolver(PersonsSuggestions)
export class SearchPersons {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => PersonsSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchPersons(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.indexerService.search(searchTerm.toLowerCase(), ['PERSON'], skip, limit)
  }
}
