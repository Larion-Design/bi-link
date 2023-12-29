import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { CompaniesService } from '@modules/central/schema/company/services/companiesService'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { CompanyInput } from '../dto/companyInput'
import { Company } from '../dto/company'
import { UseGuards } from '@nestjs/common'
import { EntityInfo, UpdateSource, User } from 'defs'

@ArgsType()
class UpdateCompanyArgs {
  @Field(() => ID)
  companyId: string

  @Field(() => CompanyInput)
  companyInfo: CompanyInput
}

@Resolver(() => Company)
export class UpdateCompany {
  constructor(private readonly ingressService: CompaniesService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateCompany(
    @CurrentUser() { _id, role }: User,
    @Args() { companyId, companyInfo }: UpdateCompanyArgs,
  ) {
    await this.ingressService.update(companyId, companyInfo)
  }
}
