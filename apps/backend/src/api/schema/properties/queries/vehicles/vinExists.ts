import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql';
import { SearchVehiclesService } from '../../../../../search/services/search';
import { Property } from '../../dto/property';

@ArgsType()
class Params {
  @Field()
  vin: string;

  @Field({ nullable: true })
  vehicleId?: string;
}

@Resolver(() => Property)
export class VinExists {
  constructor(private readonly searchVehiclesService: SearchVehiclesService) {}

  @Query(() => Boolean)
  async vinExists(@Args() { vin, vehicleId }: Params) {
    return this.searchVehiclesService.vinExists(vin, vehicleId);
  }
}
