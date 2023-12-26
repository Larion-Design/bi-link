import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CompaniesService } from '@modules/central/schema/company/services/companiesService';
import { User } from 'defs';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { Company } from '../dto/company';

@ArgsType()
class Params {
  @Field(() => [ID])
  companiesIds: string[];
}

@Resolver(() => Company)
export class GetCompanies {
  constructor(private readonly ingressService: CompaniesService) {}

  @Query(() => [Company])
  @UseGuards(FirebaseAuthGuard)
  async getCompanies(
    @CurrentUser() { _id }: User,
    @Args() { companiesIds }: Params,
  ) {
    if (companiesIds.length) {
      return this.ingressService.getCompanies(companiesIds, true);
    }
    return [];
  }
}
