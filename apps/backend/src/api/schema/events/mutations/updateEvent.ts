import { EventAPIService } from '@modules/central/schema/event/services/eventAPIService'
import { EntityEventDispatcherService } from '@modules/entity-events'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { EventInput } from '../dto/eventInput'
import { Event } from '../dto/event'

@ArgsType()
class Params {
  @Field(() => ID)
  eventId: string

  @Field(() => EventInput)
  data: EventInput
}

@Resolver(() => Event)
export class UpdateEvent {
  constructor(
    private readonly eventsService: EventAPIService,
    private readonly entityEventDispatcherService: EntityEventDispatcherService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateEvent(@CurrentUser() { _id }: User, @Args() { eventId, data }: Params) {
    return this.eventsService.update(eventId, data)
  }
}
