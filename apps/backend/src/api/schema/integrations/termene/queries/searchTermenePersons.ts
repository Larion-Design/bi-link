import { UseGuards } from '@nestjs/common';
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql';
import { FirebaseAuthGuard } from '@modules/iam';
import { OSINTPerson } from '../../shared/dto/osintPerson';

@ArgsType()
class Params {
  @Field()
  name: string;
}

@Resolver(() => OSINTPerson)
export class SearchTermenePersons {
  @Query(() => [OSINTPerson])
  @UseGuards(FirebaseAuthGuard)
  async searchTermenePersons(@Args() { name }: Params) {
    //
  }
}
