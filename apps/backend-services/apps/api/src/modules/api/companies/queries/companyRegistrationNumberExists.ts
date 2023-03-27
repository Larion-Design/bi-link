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
