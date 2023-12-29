import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { ProceedingsService } from '@modules/central/schema/proceeding/services/proceedingsService'
import { EntityInfo, UpdateSource, User } from 'defs'
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
  constructor(private readonly ingressService: ProceedingsService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateProceeding(
    @CurrentUser() { _id, role }: User,
    @Args() { proceedingId, data }: Params,
  ) {
    await this.ingressService.update(proceedingId, data)
    return proceedingId
  }
}
