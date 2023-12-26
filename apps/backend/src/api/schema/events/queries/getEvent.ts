import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql';
import { EventsService } from '@modules/central/schema/event/services/eventsService';
import { User } from 'defs';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { Event } from '../dto/event';
import { UseGuards } from '@nestjs/common';

@ArgsType()
class Params {
  @Field(() => ID)
  eventId: string;
}

@Resolver(() => Event)
export class GetEvent {
  constructor(private readonly ingressService: EventsService) {}

  @Query(() => Event)
  @UseGuards(FirebaseAuthGuard)
  async getEvent(@CurrentUser() { _id }: User, @Args() { eventId }: Params) {
    return this.ingressService.getEvent(eventId, true);
  }
}
