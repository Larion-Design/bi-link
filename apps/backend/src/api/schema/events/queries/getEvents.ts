import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventsService } from '@modules/central/schema/event/services/eventsService';
import { User } from 'defs';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { Event } from '../dto/event';

@ArgsType()
class Params {
  @Field(() => [ID])
  readonly eventsIds: string[];
}

@Resolver(() => Event)
export class GetEvents {
  constructor(private readonly ingressService: EventsService) {}

  @Query(() => [Event])
  @UseGuards(FirebaseAuthGuard)
  async getEvents(@CurrentUser() { _id }: User, @Args() { eventsIds }: Params) {
    if (eventsIds.length) {
      return this.ingressService.getEvents(eventsIds, true);
    }
    return [];
  }
}
