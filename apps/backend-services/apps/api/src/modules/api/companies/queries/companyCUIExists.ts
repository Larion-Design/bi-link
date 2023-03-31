import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { Company } from '../dto/company'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => ID, { nullable: true })
  companyId?: string

  @Field()
  cui: string
}

@Resolver(() => Company)
export class CompanyCUIExists {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async companyCUIExists(@Args() { companyId, cui }: Params) {
    return this.indexerService.companyCUIExists(cui, companyId)
  }
}
