import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../../users/guards/FirebaseAuthGuard'
import { SearchVehiclesService } from '../../../../search/services/searchVehiclesService'
import { Property } from '../../dto/property'

@ArgsType()
class Params {
  @Field({ nullable: true })
  maker?: string
}

@Resolver(() => Property)
export class GetModels {
  constructor(private readonly searchVehiclesService: SearchVehiclesService) {}

  @Query(() => [String])
  @UseGuards(FirebaseAuthGuard)
  async getModels(@Args() { maker }: Params) {
    return this.searchVehiclesService.getModels(maker)
  }
}
