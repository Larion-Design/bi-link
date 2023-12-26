import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CompaniesService } from '@modules/central/schema/company/services/companiesService';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { CompanyInput } from '../dto/companyInput';
import { Company } from '../dto/company';
import { User } from 'defs';

@ArgsType()
class CreateCompanyArgs {
  @Field(() => CompanyInput)
  data: CompanyInput;
}

@Resolver(() => Company)
export class CreateCompany {
  constructor(private readonly companiesService: CompaniesService) {}
  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createCompany(
    @CurrentUser() { _id }: User,
    @Args() { data }: CreateCompanyArgs,
  ) {
    return this.companiesService.create(data);
  }
}
