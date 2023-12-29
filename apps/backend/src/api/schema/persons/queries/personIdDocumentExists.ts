import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '@modules/iam'
import { SearchPersonsService } from '@modules/search/services/search'
import { Person } from '../dto/person'
import { UseGuards } from '@nestjs/common'

@ArgsType()
class Params {
  @Field()
  documentNumber: string

  @Field(() => ID, { nullable: true })
  personId?: string
}

@Resolver(() => Person)
export class PersonIdDocumentExists {
  constructor(private readonly indexerService: SearchPersonsService) {}

  @Query(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async personIdDocumentExists(@Args() { documentNumber, personId }: Params) {
    return this.indexerService.idDocumentExists(documentNumber, personId)
  }
}
