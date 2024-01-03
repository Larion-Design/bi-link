import { EventAPIService } from '@modules/central/schema/event/services/eventAPIService'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { EventInput } from '../dto/eventInput'
import { Event } from '../dto/event'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'

@ArgsType()
class Params {
  @Field(() => EventInput)
  data: EventInput
}

@Resolver(() => Event)
export class CreateEvent {
  constructor(private readonly eventsService: EventAPIService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createEvent(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.eventsService.create(data)
  }
}
