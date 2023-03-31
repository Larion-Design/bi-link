import { IngressService } from '@app/rpc/microservices/ingress'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Person } from '../dto/person'

@ArgsType()
class Params {
  @Field(() => ID)
  id: string
}

@Resolver(() => Person)
export class GetPerson {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => Person)
  @UseGuards(FirebaseAuthGuard)
  async getPersonInfo(@CurrentUser() { _id }: User, @Args() { id }: Params) {
    return this.ingressService.getEntity({ entityId: id, entityType: 'PERSON' }, true, {
      type: 'USER',
      sourceId: _id,
    })
  }
}
