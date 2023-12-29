import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { PropertiesService } from '@modules/central/schema/property/services/propertiesService'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Property } from '../dto/property'
import { PropertyInput } from '../dto/propertyInput'
import { User } from 'defs'
import { UseGuards } from '@nestjs/common'

@ArgsType()
class Params {
  @Field(() => PropertyInput)
  data: PropertyInput
}

@Resolver(() => Property)
export class CreateProperty {
  constructor(private readonly ingressService: PropertiesService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createProperty(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.ingressService.create(data)
  }
}
