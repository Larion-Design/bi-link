import { UseGuards } from '@nestjs/common';
import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql';
import { FirebaseAuthGuard } from '@modules/iam';
import { OSINTCompany } from '../../shared/dto/osintCompany';

@ArgsType()
class Params {
  @Field()
  cui: string;
}

@Resolver(() => OSINTCompany)
export class ImportTermeneCompany {
  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  importTermeneCompany(@Args() { cui }: Params) {
    return true;
  }
}
