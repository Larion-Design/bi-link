import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Property } from '../dto/property'

@ArgsType()
class Params {
  @Field(() => [String])
  propertiesIds: string[]
}

@Resolver(() => Property)
export class GetProperties {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => [Property])
  @UseGuards(FirebaseAuthGuard)
  async getProperties(@CurrentUser() { _id }: User, @Args() { propertiesIds }: Params) {
    if (propertiesIds.length) {
      return this.ingressService.getEntities(propertiesIds, 'PROPERTY', true, {
        type: 'USER',
        sourceId: _id,
      })
    }
    return []
  }
}
