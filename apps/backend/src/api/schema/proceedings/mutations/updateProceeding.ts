import { ProceedingAPIService } from '@modules/central/schema/proceeding/services/proceedingAPIService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Proceeding } from '../dto/proceeding'
import { ProceedingInput } from '../dto/proceedingInput'

@ArgsType()
class Params {
  @Field(() => ID)
  proceedingId: string

  @Field(() => ProceedingInput)
  data: ProceedingInput
}

@Resolver(() => Proceeding)
export class UpdateProceeding {
  constructor(private readonly proceedingsApiService: ProceedingAPIService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateProceeding(@CurrentUser() { _id }: User, @Args() { proceedingId, data }: Params) {
    await this.proceedingsApiService.update(proceedingId, data)
    return proceedingId
  }
}
