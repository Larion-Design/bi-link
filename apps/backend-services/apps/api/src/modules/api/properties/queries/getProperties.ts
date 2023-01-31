import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Property } from '../dto/property'
import { PropertiesService } from '@app/entities/services/propertiesService'

@ArgsType()
class Params {
  @Field(() => [String])
  propertiesIds: string[]
}

@Resolver(() => Property)
export class GetProperties {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Query(() => [Property])
  @UseGuards(FirebaseAuthGuard)
  async getProperties(@Args() { propertiesIds }: Params) {
    return propertiesIds.length ? this.propertiesService.getProperties(propertiesIds) : []
  }
}
