import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { Event } from '../dto/event'
import { EventsService } from '@app/entities/services/eventsService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => [String])
  readonly eventsIds: string[]
}

@Resolver(() => Event)
export class GetEvents {
  constructor(private readonly eventsService: EventsService) {}

  @Query(() => [Event])
  @UseGuards(FirebaseAuthGuard)
  async getEvents(@Args() { eventsIds }: Params) {
    return eventsIds.length ? this.eventsService.getEvents(eventsIds, true) : []
  }
}
