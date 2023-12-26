import { UseGuards } from '@nestjs/common';
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql';
import { ProceedingsService } from '@modules/central/schema/proceeding/services/proceedingsService';
import { User } from 'defs';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { Proceeding } from '../dto/proceeding';

@ArgsType()
class Params {
  @Field(() => ID)
  proceedingId: string;
}

@Resolver(() => Proceeding)
export class GetProceeding {
  constructor(private readonly ingressService: ProceedingsService) {}

  @Query(() => Proceeding)
  @UseGuards(FirebaseAuthGuard)
  async getProceeding(
    @CurrentUser() { _id }: User,
    @Args() { proceedingId }: Params,
  ) {
    return this.ingressService.getProceeding(proceedingId, true);
  }
}
