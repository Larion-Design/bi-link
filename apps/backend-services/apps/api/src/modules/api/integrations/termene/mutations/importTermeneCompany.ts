import { OsintTermeneService } from '@app/rpc/microservices/osint/termene'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '../../../../users/guards/FirebaseAuthGuard'
import { OSINTCompany } from '../../shared/dto/osintCompany'

@ArgsType()
class Params {
  @Field()
  cui: string
}

@Resolver(() => OSINTCompany)
export class ImportTermeneCompany {
  constructor(private readonly osintTermeneService: OsintTermeneService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  importTermeneCompany(@Args() { cui }: Params) {
    this.osintTermeneService.importCompany(cui)
    return true
  }
}
