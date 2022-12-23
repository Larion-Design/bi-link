import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchPaginationArgs } from '../../common/dto/searchPaginationArgs'
import { SearchCompaniesService } from '../../../search/services/searchCompaniesService'
import { CompaniesSuggestions } from '../dto/companiesSuggestions'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@Resolver(() => CompaniesSuggestions)
export class SearchCompanies {
  constructor(private readonly searchCompaniesService: SearchCompaniesService) {}

  @Query(() => CompaniesSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchCompanies(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.searchCompaniesService.searchBasicSuggestions(searchTerm, skip, limit)
  }
}
