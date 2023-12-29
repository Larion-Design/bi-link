import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Location } from '../dto/location'

@ArgsType()
class Params {
  @Field(() => [String])
  readonly locationsIds: string[]
}

@Resolver(() => Location)
export class GetLocations {
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
