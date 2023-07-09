import { OsintTermeneService } from '@app/rpc/microservices/osint/termene'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '../../../../users/guards/FirebaseAuthGuard'
import { OSINTCompany } from '../../shared/dto/osintCompany'

@ArgsType()
class Params {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  cui?: string
}

@Resolver(() => OSINTCompany)
export class SearchTermeneCompanies {
  constructor(private readonly osintTermeneService: OsintTermeneService) {}

  @Query(() => [OSINTCompany])
  @UseGuards(FirebaseAuthGuard)
  async searchTermeneCompanies(@Args() { name, cui }: Params) {
    if (cui?.length) {
      return this.osintTermeneService.searchCompanyByCUI(cui)
    }
    if (name?.length) {
      return this.osintTermeneService.searchCompaniesByName(name)
    }
  }
}
