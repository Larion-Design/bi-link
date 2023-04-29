import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { EntityInfo, UpdateSource, User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { EventInput } from '../dto/eventInput'
import { Event } from '../dto/event'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'

@ArgsType()
class Params {
  @Field(() => ID)
  eventId: string

  @Field(() => EventInput)
  data: EventInput
}

@Resolver(() => Event)
export class UpdateEvent {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateEvent(@CurrentUser() { _id, role }: User, @Args() { eventId, data }: Params) {
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
