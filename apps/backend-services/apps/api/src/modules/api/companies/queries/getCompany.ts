import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { IsMongoId } from 'class-validator'
import { Company } from '../dto/company'
import { CompaniesService } from '@app/entities/services/companiesService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @IsMongoId()
  @Field()
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
