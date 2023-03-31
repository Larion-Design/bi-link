import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { EventInput } from '../dto/eventInput'
import { Event } from '../dto/event'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { EntityInfo, UpdateSource, User } from 'defs'

@ArgsType()
class UpdateEventArgs {
  @Field(() => ID)
  eventId: string

  @Field(() => EventInput)
  data: EventInput
}

@Resolver(() => Event)
export class UpdateEvent {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async updateEvent(
    @CurrentUser() { _id, role }: User,
    @Args() { eventId, data }: UpdateEventArgs,
  ) {
    const source: UpdateSource = {
      sourceId: _id,
      type: 'USER',
    }

    const entityInfo: EntityInfo = {
      entityId: eventId,
      entityType: 'EVENT',
    }

    if (role === 'ADMIN') {
      return this.ingressService.updateEntity(entityInfo, data, source)
    } else {
      return this.ingressService.createPendingSnapshot(entityInfo, data, source)
    }
  }
}
