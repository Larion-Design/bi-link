import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { CompaniesService } from '@app/entities/services/companiesService'
import { Company } from '../dto/company'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => [String])
  companiesIds: string[]
}

@Resolver(() => Company)
export class GetCompanies {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => [Company])
  @UseGuards(FirebaseAuthGuard)
  async getCompanies(@Args() { companiesIds }: Params) {
    return companiesIds.length ? this.companiesService.getCompanies(companiesIds) : []
  }
}
