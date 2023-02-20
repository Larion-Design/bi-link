import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { EventInput } from '../dto/eventInput'
import { Event } from '../dto/event'
import { IncidentAPIService } from '../services/incidentAPIService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/pub/services/userActionsService'
import { EntityEventsService } from '@app/pub/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { User, UserActions } from 'defs'
import { getUnixTime } from 'date-fns'

@ArgsType()
class UpdateIncidentArgs {
  @Field()
  incidentId: string

  @Field(() => EventInput)
  data: EventInput
}

@Resolver(() => Event)
export class UpdateIncident {
  constructor(
    private readonly incidentAPIService: IncidentAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async updateIncident(
    @CurrentUser() { _id }: User,
    @Args() { incidentId, data }: UpdateIncidentArgs,
  ) {
    const updated = await this.incidentAPIService.update(incidentId, data)

    if (updated) {
      this.entityEventsService.emitEntityModified({
        entityId: incidentId,
        entityType: 'INCIDENT',
      })

      this.userActionsService.recordAction({
        eventType: UserActions.ENTITY_UPDATED,
        author: _id,
        timestamp: getUnixTime(new Date()),
        target: incidentId,
        targetType: 'INCIDENT',
      })
    }
    return incidentId
  }
}
