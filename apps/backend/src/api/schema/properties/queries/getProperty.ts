import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { PropertiesService } from '@modules/central/schema/property/services/propertiesService'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Property } from '../dto/property'
import { UseGuards } from '@nestjs/common'

@ArgsType()
class Params {
  @Field(() => ID)
  propertyId: string
}

@Resolver(() => Property)
export class GetProperty {
  constructor(private readonly ingressService: PropertiesService) {}

  @Query(() => Property)
  @UseGuards(FirebaseAuthGuard)
  async getProperty(@CurrentUser() { _id }: User, @Args() { propertyId }: Params) {
    return this.ingressService.getProperty(propertyId, true)
  }
}
