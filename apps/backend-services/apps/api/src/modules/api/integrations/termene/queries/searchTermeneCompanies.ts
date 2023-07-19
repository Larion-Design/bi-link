import { OsintTermeneService } from '@app/rpc/microservices/osint/termene'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '../../../../users/guards/FirebaseAuthGuard'
import { OSINTCompany } from '../../shared/dto/osintCompany'

@ArgsType()
class Params {
  @Field()
  searchTerm: string
}

@Resolver(() => OSINTCompany)
export class SearchTermeneCompanies {
  constructor(private readonly osintTermeneService: OsintTermeneService) {}

  @Query(() => [OSINTCompany])
  @UseGuards(FirebaseAuthGuard)
  async searchTermeneCompanies(@Args() { searchTerm }: Params) {
    return this.osintTermeneService.searchCompaniesByName(searchTerm)
  }
}
