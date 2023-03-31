import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { Property } from '../dto/property'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field()
  propertyId: string
}

@Resolver(() => Property)
export class GetProperty {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => Property)
  @UseGuards(FirebaseAuthGuard)
  async getProperty(@CurrentUser() { _id }: User, @Args() { propertyId }: Params) {
    return this.ingressService.getEntity({ entityId: propertyId, entityType: 'PROPERTY' }, true, {
      type: 'USER',
      sourceId: _id,
    })
  }
}
