import { Args, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '@modules/iam'
import { SearchCompaniesService } from '@modules/search/services/search'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'
import { CompaniesSuggestions } from '../dto/companiesSuggestions'
import { UseGuards } from '@nestjs/common'

@Resolver(() => CompaniesSuggestions)
export class SearchCompanies {
  constructor(private readonly searchCompaniesService: SearchCompaniesService) {}

  @Query(() => CompaniesSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchCompanies(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.searchCompaniesService.searchBasicSuggestions(searchTerm, skip, limit)
  }
}
