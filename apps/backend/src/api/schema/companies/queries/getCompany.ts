import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { CompaniesService } from '@modules/central/schema/company/services/companiesService'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Company } from '../dto/company'
import { UseGuards } from '@nestjs/common'

@ArgsType()
class Params {
  @Field(() => ID)
  id: string
}

@Resolver(() => Company)
export class GetCompany {
  constructor(private readonly ingressService: CompaniesService) {}

  @Query(() => Company)
  @UseGuards(FirebaseAuthGuard)
  async getCompany(@CurrentUser() { _id }: User, @Args() { id }: Params) {
    return this.ingressService.getCompany(id, true)
  }
}
