import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { CompaniesService } from '@app/models/services/companiesService'
import { Company } from '../dto/company'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => [ID])
  companiesIds: string[]
}

@Resolver(() => Company)
export class GetCompanies {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => [Company])
  @UseGuards(FirebaseAuthGuard)
  async getCompanies(@Args() { companiesIds }: Params) {
    return companiesIds.length ? this.companiesService.getCompanies(companiesIds, true) : []
  }
}
