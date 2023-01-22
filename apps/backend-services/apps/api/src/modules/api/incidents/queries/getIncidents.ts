import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { Incident } from '../dto/incident'
import { IncidentsService } from '@app/entities/services/incidentsService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => [String])
  readonly incidentsIds: string[]
}

@Resolver(() => Incident)
export class GetIncidents {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Query(() => [Incident])
  @UseGuards(FirebaseAuthGuard)
  async getIncidents(@Args() { incidentsIds }: Params) {
    return incidentsIds.length ? this.incidentsService.getIncidents(incidentsIds) : []
  }
}
