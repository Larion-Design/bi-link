import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../../users/guards/FirebaseAuthGuard'
import { SearchVehiclesService } from '../../../../search/services/searchVehiclesService'
import { Property } from '../../dto/property'

@ArgsType()
class Params {
  @Field({ nullable: true })
  model?: string
}

@Resolver(() => Property)
export class GetMakers {
  constructor(private readonly searchVehiclesService: SearchVehiclesService) {}

  @Query(() => [String])
  @UseGuards(FirebaseAuthGuard)
  async getMakers(@Args() { model }: Params) {
    return this.searchVehiclesService.getMakers(model)
  }
}
