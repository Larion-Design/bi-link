import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { EventInput } from '../dto/eventInput'
import { Event } from '../dto/event'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { User } from 'defs'

@ArgsType()
class CreateEventArgs {
  @Field(() => EventInput)
  data: EventInput
}

@Resolver(() => Event)
export class CreateEvent {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createEvent(@CurrentUser() { _id }: User, @Args() { data }: CreateEventArgs) {
    return this.ingressService.createEntity('EVENT', data, {
      sourceId: _id,
      type: 'USER',
    })
  }
}
