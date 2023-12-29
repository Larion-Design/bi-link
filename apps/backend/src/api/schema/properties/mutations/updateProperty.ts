import { PropertyAPIService } from '@modules/central/schema/property/services/propertyAPIService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { PropertyInput } from '../dto/propertyInput'
import { Property } from '../dto/property'

@ArgsType()
class Params {
  @Field(() => ID)
  propertyId: string

  @Field(() => PropertyInput)
  data: PropertyInput
}

@Resolver(() => Property)
export class UpdateProperty {
  constructor(private readonly propertyAPIService: PropertyAPIService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateProperty(@CurrentUser() { _id }: User, @Args() { propertyId, data }: Params) {
    await this.propertyAPIService.updateProperty(propertyId, data)
    return true
  }
}
