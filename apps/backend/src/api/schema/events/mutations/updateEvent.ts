import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { EventsService } from '@modules/central/schema/event/services/eventsService';
import { EntityInfo, UpdateSource, User } from 'defs';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { EventInput } from '../dto/eventInput';
import { Event } from '../dto/event';

@ArgsType()
class Params {
  @Field(() => ID)
  eventId: string;

  @Field(() => EventInput)
  data: EventInput;
}

@Resolver(() => Event)
export class UpdateEvent {
  constructor(private readonly ingressService: EventsService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateEvent(
    @CurrentUser() { _id, role }: User,
    @Args() { eventId, data }: Params,
  ) {
    const source: UpdateSource = {
      sourceId: _id,
      type: 'USER',
    };

    const entityInfo: EntityInfo = {
      entityId: eventId,
      entityType: 'EVENT',
    };

    return this.ingressService.update(eventId, data);
  }
}
