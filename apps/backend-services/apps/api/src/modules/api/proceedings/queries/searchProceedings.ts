import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchProceedingsService } from '../../../search/services/searchProceedingsService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'
import { ProceedingListRecord } from '../dto/proceedingListRecord'
import { ProceedingsSuggestions } from '../dto/proceedingsSuggestions'

@Resolver(() => ProceedingsSuggestions)
export class SearchProceedings {
  constructor(private readonly searchProceedingsService: SearchProceedingsService) {}

  @Query(() => [ProceedingListRecord])
  @UseGuards(FirebaseAuthGuard)
  async searchProceedings(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.searchProceedingsService.searchProceedings(searchTerm, skip, limit)
  }
}
