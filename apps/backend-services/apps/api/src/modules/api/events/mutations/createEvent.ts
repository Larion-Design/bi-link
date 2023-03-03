import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { EventInput } from '../dto/eventInput'
import { Event } from '../dto/event'
import { EventAPIService } from '../services/eventAPIService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/rpc/services/userActionsService'
import { EntityEventsService } from '@app/rpc/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { User, UserActions } from 'defs'
import { getUnixTime } from 'date-fns'

@ArgsType()
class CreateEventArgs {
  @Field(() => EventInput)
  data: EventInput
}

@Resolver(() => Event)
export class CreateEvent {
  constructor(
    private readonly eventAPIService: EventAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async createEvent(@CurrentUser() { _id }: User, @Args() { data }: CreateEventArgs) {
    const eventId = await this.eventAPIService.create(data)

    this.entityEventsService.emitEntityCreated({
      entityId: eventId,
      entityType: 'EVENT',
    })

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      target: eventId,
      targetType: 'EVENT',
    })

    return eventId
  }
}
