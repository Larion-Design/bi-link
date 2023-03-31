import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { SearchPaginationArgs } from '../../search/dto/searchPaginationArgs'
import { ProceedingListRecord } from '../dto/proceedingListRecord'
import { ProceedingsSuggestions } from '../dto/proceedingsSuggestions'

@Resolver(() => ProceedingsSuggestions)
export class SearchProceedings {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => [ProceedingListRecord])
  @UseGuards(FirebaseAuthGuard)
  async searchProceedings(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.indexerService.search(searchTerm.toLowerCase(), ['PROCEEDING'], skip, limit)
  }
}
