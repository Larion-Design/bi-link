import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { Property } from '../dto/property'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field()
  propertyId: string
}

@Resolver(() => Property)
export class GetProperty {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Query(() => Property)
  @UseGuards(FirebaseAuthGuard)
  async getProperty(@Args() { propertyId }: Params) {
    return this.propertiesService.getProperty(propertyId, true)
  }
}
