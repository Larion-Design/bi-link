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
  registrationNumber: string
}

@Resolver(() => Company)
export class CompanyRegistrationNumberExists {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async companyRegistrationNumberExists(@Args() { companyId, registrationNumber }: Params) {
    return this.indexerService.companyRegistrationNumberExists(registrationNumber, companyId)
  }
}
