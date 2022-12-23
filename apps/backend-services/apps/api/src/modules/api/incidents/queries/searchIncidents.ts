import { Args, Query, Resolver } from '@nestjs/graphql'
import { SearchPaginationArgs } from '../../common/dto/searchPaginationArgs'
import { Incident } from '../dto/incident'
import { IncidentsSuggestions } from '../dto/incidentsSuggestions'
import { SearchIncidentsService } from '../../../search/services/searchIncidentsService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@Resolver(() => Incident)
export class SearchIncidents {
  constructor(private readonly searchIncidentsService: SearchIncidentsService) {}

  @Query(() => IncidentsSuggestions)
  @UseGuards(FirebaseAuthGuard)
  async searchIncidents(@Args() { searchTerm, skip, limit }: SearchPaginationArgs) {
    return this.searchIncidentsService.searchBasicSuggestions(searchTerm.toLowerCase(), skip, limit)
  }
}
