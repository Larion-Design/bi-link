import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'
import { CompaniesSuggestions } from '../dto/companiesSuggestions'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@Resolver(() => CompaniesSuggestions)
export class SearchCompanies {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => CompaniesSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchCompanies(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.indexerService.search(searchTerm, ['COMPANY'], limit, skip)
  }
}
