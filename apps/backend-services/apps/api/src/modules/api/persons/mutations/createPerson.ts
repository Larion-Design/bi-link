import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { Person } from '../dto/person'
import { PersonInput } from '../dto/personInput'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'

@ArgsType()
class Params {
  @Field(() => PersonInput)
  data: PersonInput
}

@Resolver(() => Person)
export class CreatePerson {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createPerson(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.ingressService.createEntity('PERSON', data, {
      type: 'USER',
      sourceId: _id,
    })
  }
}
