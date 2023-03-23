import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { ProceedingsService } from '@app/models/services/proceedingsService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Proceeding } from '../dto/proceeding'

@ArgsType()
class Params {
  @Field()
  proceedingId: string
}

@Resolver(() => Proceeding)
export class GetProceeding {
  constructor(private readonly proceedingsService: ProceedingsService) {}

  @Query(() => Proceeding)
  @UseGuards(FirebaseAuthGuard)
  async getProceeding(@Args() { proceedingId }: Params) {
    return this.proceedingsService.getProceeding(proceedingId, true)
  }
}
