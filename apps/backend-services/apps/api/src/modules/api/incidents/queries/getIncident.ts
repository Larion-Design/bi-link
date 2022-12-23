import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { IncidentsService } from '@app/entities/services/incidentsService'
import { Incident } from '../dto/incident'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field()
  incidentId: string
}

@Resolver(() => Incident)
export class GetIncident {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Query(() => Incident)
  @UseGuards(FirebaseAuthGuard)
  async getIncident(@Args() { incidentId }: Params) {
    return this.incidentsService.getIncident(incidentId)
  }
}
