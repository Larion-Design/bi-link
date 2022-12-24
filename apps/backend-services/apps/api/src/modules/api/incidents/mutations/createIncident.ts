import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { IncidentInput } from '../dto/incidentInput'
import { Incident } from '../dto/incident'
import { IncidentAPIService } from '../services/incidentAPIService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/pub/services/userActionsService'
import { EntityEventsService } from '@app/pub/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { User, UserActions } from 'defs'
import { getUnixTime } from 'date-fns'

@ArgsType()
class CreateIncidentArgs {
  @Field(() => IncidentInput)
  data: IncidentInput
}

@Resolver(() => Incident)
export class CreateIncident {
  constructor(
    private readonly incidentAPIService: IncidentAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async createIncident(@CurrentUser() { _id }: User, @Args() { data }: CreateIncidentArgs) {
    const incidentId = await this.incidentAPIService.create(data)

    this.entityEventsService.emitEntityCreated({
      entityId: incidentId,
      entityType: 'INCIDENT',
    })

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      target: incidentId,
      targetType: 'INCIDENT',
    })

    return incidentId
  }
}
