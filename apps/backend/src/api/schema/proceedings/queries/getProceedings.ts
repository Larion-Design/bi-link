import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { ProceedingsService } from '@modules/central/schema/proceeding/services/proceedingsService'

import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Proceeding } from '../dto/proceeding'

@ArgsType()
class Params {
  @Field(() => [ID])
  proceedingsIds: string[]
}

@Resolver(() => Proceeding)
export class GetProceedings {
  constructor(private readonly ingressService: ProceedingsService) {}

  @Query(() => [Proceeding])
  @UseGuards(FirebaseAuthGuard)
  async getProceedings(@CurrentUser() { _id }: User, @Args() { proceedingsIds }: Params) {
    return this.ingressService.getProceedings(proceedingsIds, true)
  }
}
