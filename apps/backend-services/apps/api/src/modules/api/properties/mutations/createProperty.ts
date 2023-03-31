import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { Property } from '../dto/property'
import { PropertyInput } from '../dto/propertyInput'
import { User } from 'defs'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'

@ArgsType()
class Params {
  @Field(() => PropertyInput)
  data: PropertyInput
}

@Resolver(() => Property)
export class CreateProperty {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createProperty(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.ingressService.createEntity('PROPERTY', data, {
      type: 'USER',
      sourceId: _id,
    })
  }
}
