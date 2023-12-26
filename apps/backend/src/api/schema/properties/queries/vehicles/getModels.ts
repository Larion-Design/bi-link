import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '@modules/iam';
import { SearchVehiclesService } from '@modules/search/services/search';
import { Property } from '../../dto/property';

@ArgsType()
class Params {
  @Field({ nullable: true })
  maker?: string;
}

@Resolver(() => Property)
export class GetModels {
  constructor(private readonly indexerService: SearchVehiclesService) {}

  @Query(() => [String])
  @UseGuards(FirebaseAuthGuard)
  async getModels(@Args() { maker }: Params) {
    return this.indexerService.getModels(maker);
  }
}
