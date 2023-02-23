import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { EventInput } from '../dto/eventInput'
import { Event } from '../dto/event'
import { EventAPIService } from '../services/eventAPIService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/pub/services/userActionsService'
import { EntityEventsService } from '@app/pub/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { User, UserActions } from 'defs'
import { getUnixTime } from 'date-fns'

@ArgsType()
class UpdateEventArgs {
  @Field()
  eventId: string

  @Field(() => EventInput)
  data: EventInput
}

@Resolver(() => Event)
export class UpdateEvent {
  constructor(
    private readonly eventAPIService: EventAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async updateEvent(@CurrentUser() { _id }: User, @Args() { eventId, data }: UpdateEventArgs) {
    const updated = await this.eventAPIService.update(eventId, data)

    if (updated) {
      this.entityEventsService.emitEntityModified({
        entityId: eventId,
        entityType: 'EVENT',
      })

      this.userActionsService.recordAction({
        eventType: UserActions.ENTITY_UPDATED,
        author: _id,
        timestamp: getUnixTime(new Date()),
        target: eventId,
        targetType: 'EVENT',
      })
    }
    return eventId
  }
}
