import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '@modules/iam'
import { SearchCompaniesService } from '@modules/search/services/search'
import { Company } from '../dto/company'

@ArgsType()
class Params {
  @Field(() => ID, { nullable: true })
  companyId?: string

  @Field()
  registrationNumber: string
}

@Resolver(() => Company)
export class CompanyRegistrationNumberExists {
  constructor(private readonly searchCompaniesService: SearchCompaniesService) {}

  @Query(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async companyRegistrationNumberExists(@Args() { companyId, registrationNumber }: Params) {
    return this.searchCompaniesService.registrationNumberExists(registrationNumber, companyId)
  }
}
