import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { ProceedingsService } from '@app/models/services/proceedingsService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Proceeding } from '../dto/proceeding'

@ArgsType()
class Params {
  @Field(() => [String])
  proceedingsIds: string[]
}

@Resolver(() => Proceeding)
export class GetProceedings {
  constructor(private readonly proceedingsService: ProceedingsService) {}

  @Query(() => [Proceeding])
  @UseGuards(FirebaseAuthGuard)
  async getProceeding(@Args() { proceedingsIds }: Params) {
    return this.proceedingsService.getProceedings(proceedingsIds, true)
  }
}
