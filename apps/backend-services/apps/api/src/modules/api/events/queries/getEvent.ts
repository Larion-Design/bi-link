import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
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
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => Event)
  @UseGuards(FirebaseAuthGuard)
  async getEvent(@CurrentUser() { _id }: User, @Args() { eventId }: Params) {
    return this.ingressService.getEntity({ entityId: eventId, entityType: 'EVENT' }, true, {
      type: 'USER',
      sourceId: _id,
    })
  }
}
