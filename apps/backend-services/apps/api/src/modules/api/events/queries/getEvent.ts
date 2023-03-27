import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { EventsService } from '@app/models/services/eventsService'
import { Event } from '../dto/event'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => ID)
  eventId: string
}

@Resolver(() => Event)
export class GetEvent {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => Event)
  @UseGuards(FirebaseAuthGuard)
  async getEvent(@Args() { eventId }: Params) {
    return this.eventsService.getEvent(eventId, true)
  }
}
