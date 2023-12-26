import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '@modules/iam';
import { SearchVehiclesService } from '@modules/search/services/search';
import { Property } from '../../dto/property';

@ArgsType()
class Params {
  @Field({ nullable: true })
  model?: string;
}

@Resolver(() => Property)
export class GetMakers {
  constructor(private readonly indexerService: SearchVehiclesService) {}

  @Query(() => [String])
  @UseGuards(FirebaseAuthGuard)
  async getMakers(@Args() { model }: Params) {
    return this.indexerService.getMakers(model);
  }
}
