import { LocationsService } from '@app/models/location/services/locationsService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Location } from '../dto/location'

@ArgsType()
class Params {
  @Field(() => [String])
  readonly locationsIds: string[]
}

@Resolver(() => Location)
export class GetLocations {
  constructor(protected readonly locationsService: LocationsService) {}

  @Query(() => Location)
  @UseGuards(FirebaseAuthGuard)
  async getLocations(@Args() { locationsIds }: Params) {
    return this.locationsService.getLocations(locationsIds)
  }
}