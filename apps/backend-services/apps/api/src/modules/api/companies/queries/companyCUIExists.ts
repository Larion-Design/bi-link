import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { SearchCompaniesService } from '../../../search/services/searchCompaniesService'
import { Company } from '../dto/company'
import { UseGuards } from '@nestjs/common'
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
  constructor(private readonly searchCompaniesService: SearchCompaniesService) {}

  @Query(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async companyCUIExists(@Args() { companyId, cui }: Params) {
    return this.searchCompaniesService.cuiExists(cui, companyId)
  }
}
