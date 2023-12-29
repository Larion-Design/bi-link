import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { PropertiesService } from '@modules/central/schema/property/services/propertiesService'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Property } from '../dto/property'

@ArgsType()
class Params {
  @Field(() => [ID])
  propertiesIds: string[]
}

@Resolver(() => Property)
export class GetProperties {
  constructor(private readonly ingressService: PropertiesService) {}

  @Query(() => [Property])
  @UseGuards(FirebaseAuthGuard)
  async getProperties(@CurrentUser() { _id }: User, @Args() { propertiesIds }: Params) {
    if (propertiesIds.length) {
      return this.ingressService.getProperties(propertiesIds, true)
    }
    return []
  }
}
