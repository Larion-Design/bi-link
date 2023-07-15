import { OsintTermeneService } from '@app/rpc/microservices/osint/termene'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '../../../../users/guards/FirebaseAuthGuard'
import { OSINTPerson } from '../../shared/dto/osintPerson'

@ArgsType()
class Params {
  @Field()
  name: string
}

@Resolver(() => OSINTPerson)
export class SearchTermenePersons {
  constructor(private readonly osintTermeneService: OsintTermeneService) {}

  @Query(() => [OSINTPerson])
  @UseGuards(FirebaseAuthGuard)
  async searchTermenePersons(@Args() { name }: Params) {
    return this.osintTermeneService.searchPersons(name)
  }
}
