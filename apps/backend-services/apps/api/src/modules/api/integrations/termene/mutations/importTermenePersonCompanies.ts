import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { OsintTermeneService } from '@app/rpc/microservices/osint/termene'
import { FirebaseAuthGuard } from '../../../../users/guards/FirebaseAuthGuard'
import { OSINTPerson } from '../../shared/dto/osintPerson'

@ArgsType()
class Params {
  @Field()
  url: string
}

@Resolver(() => OSINTPerson)
export class ImportTermenePersonCompanies {
  constructor(private readonly osintTermeneService: OsintTermeneService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  importTermenePersonCompanies(@Args() { url }: Params) {
    this.osintTermeneService.importPersonCompanies(url)
    return true
  }
}
