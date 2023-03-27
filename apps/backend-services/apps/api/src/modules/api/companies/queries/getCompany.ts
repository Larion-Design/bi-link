import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { Company } from '../dto/company'
import { CompaniesService } from '@app/models/services/companiesService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => ID)
  id: string
}

@Resolver(() => Company)
export class GetCompany {
  constructor(private readonly companiesService: CompaniesService) {}

  @Query(() => Company)
  @UseGuards(FirebaseAuthGuard)
  async getCompany(@Args() { id }: Params) {
    return this.companiesService.getCompany(id, true)
  }
}
