import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { FirebaseAuthGuard } from '@modules/iam';
import { SearchProceedingsService } from '@modules/search/services/search';
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs';
import { ProceedingListRecord } from '../dto/proceedingListRecord';
import { ProceedingsSuggestions } from '../dto/proceedingsSuggestions';

@Resolver(() => ProceedingsSuggestions)
export class SearchProceedings {
  constructor(private readonly indexerService: SearchProceedingsService) {}

  @Query(() => [ProceedingListRecord])
  @UseGuards(FirebaseAuthGuard)
  async searchProceedings(
    @Args() { searchTerm, skip, limit }: SearchPaginationArgs,
  ) {
    return this.indexerService.searchProceedings(
      searchTerm.toLowerCase(),
      skip,
      limit,
    );
  }
}
