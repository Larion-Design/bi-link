import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { IsMongoId, IsOptional } from 'class-validator'
import { SearchCompaniesService } from '../../../search/services/searchCompaniesService'
import { Company } from '../dto/company'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @IsOptional()
  @IsMongoId()
  @Field({ nullable: true })
  companyId?: string

  @Field()
  cui: string
}

@Resolver(() => Company)
export class CompanyCUIExists {
  constructor(private readonly searchCompaniesService: SearchCompaniesService) {}

  @Query(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async companyCUIExists(@Args() { companyId, cui }: Params) {
    return this.searchCompaniesService.cuiExists(cui, companyId)
  }
}
