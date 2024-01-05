import { CompanyAPIService } from '@modules/central/schema/company/services/companyAPIService'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { CompanyInput } from '../dto/companyInput'
import { Company } from '../dto/company'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'

@ArgsType()
class UpdateCompanyArgs {
  @Field(() => ID)
  companyId: string

  @Field(() => CompanyInput)
  companyInfo: CompanyInput
}

@Resolver(() => Company)
export class UpdateCompany {
  constructor(private readonly companiesService: CompanyAPIService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateCompany(
    @CurrentUser() { _id }: User,
    @Args() { companyId, companyInfo }: UpdateCompanyArgs,
  ) {
    await this.companiesService.update(companyId, companyInfo)
    return true
  }
}
