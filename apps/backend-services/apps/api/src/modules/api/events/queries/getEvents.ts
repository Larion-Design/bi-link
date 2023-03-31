import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { Event } from '../dto/event'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => [ID])
  readonly eventsIds: string[]
}

@Resolver(() => Event)
export class GetEvents {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => [Event])
  @UseGuards(FirebaseAuthGuard)
  async getEvents(@CurrentUser() { _id }: User, @Args() { eventsIds }: Params) {
    if (eventsIds.length) {
      return this.ingressService.getEntities(eventsIds, 'EVENT', true, {
        sourceId: _id,
        type: 'USER',
      })
    }
    return []
  }
}
