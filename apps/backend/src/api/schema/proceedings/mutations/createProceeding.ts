import { ProceedingAPIService } from '@modules/central/schema/proceeding/services/proceedingAPIService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'

import { Proceeding } from '../dto/proceeding'
import { ProceedingInput } from '../dto/proceedingInput'

@ArgsType()
class Params {
  @Field(() => ProceedingInput)
  data: ProceedingInput
}

@Resolver(() => Proceeding)
export class CreateProceeding {
  constructor(private readonly proceedingsApiService: ProceedingAPIService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createProceeding(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.proceedingsApiService.create(data)
  }
}
