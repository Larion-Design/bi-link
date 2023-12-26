import { UseGuards } from '@nestjs/common';
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql';
import { FirebaseAuthGuard } from '@modules/iam';
import { OSINTCompany } from '../../shared/dto/osintCompany';

@ArgsType()
class Params {
  @Field()
  searchTerm: string;
}

@Resolver(() => OSINTCompany)
export class SearchTermeneCompanies {
  constructor() {
    //
  }

  @Query(() => [OSINTCompany])
  @UseGuards(FirebaseAuthGuard)
  async searchTermeneCompanies(@Args() { searchTerm }: Params) {
    return Promise.reject(searchTerm);
  }
}
