import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Location } from '../dto/location'

@ArgsType()
class Params {
  @Field(() => [String])
  readonly locationsIds: string[]
}

@Resolver(() => Location)
export class GetLocations {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => Location)
  @UseGuards(FirebaseAuthGuard)
  async getLocations(@CurrentUser() { _id }: User, @Args() { locationsIds }: Params) {
    if (locationsIds.length) {
      return this.ingressService.getEntities(locationsIds, 'LOCATION', false, {
        sourceId: _id,
        type: 'USER',
      })
    }
    return []
  }
}
