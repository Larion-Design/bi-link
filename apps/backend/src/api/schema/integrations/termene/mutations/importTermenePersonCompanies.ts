import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '@modules/iam'
import { OSINTPerson } from '../../shared/dto/osintPerson'

@ArgsType()
class Params {
  @Field()
  url: string
}

@Resolver(() => OSINTPerson)
export class ImportTermenePersonCompanies {
  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  importTermenePersonCompanies(@Args() { url }: Params) {
    return true
  }
}
