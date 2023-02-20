import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { EventsService } from '@app/entities/services/eventsService'
import { Event } from '../dto/event'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field()
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
