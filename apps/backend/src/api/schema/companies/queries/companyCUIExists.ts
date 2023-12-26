import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from '@modules/iam';
import { SearchCompaniesService } from '@modules/search/services/search';
import { Company } from '../dto/company';

@ArgsType()
class Params {
  @Field(() => ID, { nullable: true })
  companyId?: string;

  @Field()
  cui: string;
}

@Resolver(() => Company)
export class CompanyCUIExists {
  constructor(private readonly indexerService: SearchCompaniesService) {}

  @Query(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async companyCUIExists(@Args() { companyId, cui }: Params) {
    return this.indexerService.cuiExists(cui, companyId);
  }
}
