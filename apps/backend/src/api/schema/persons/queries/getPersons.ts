import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { PersonsService } from '@modules/central/schema/person/services/personsService'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Person } from '../dto/person'

@ArgsType()
class Params {
  @Field(() => [ID])
  personsIds: string[]
}

@Resolver(() => Person)
export class GetPersons {
  constructor(private readonly ingressService: PersonsService) {}

  @Query(() => [Person])
  @UseGuards(FirebaseAuthGuard)
  async getPersonsInfo(@CurrentUser() { _id }: User, @Args() { personsIds }: Params) {
    if (personsIds.length) {
      return this.ingressService.getPersons(personsIds, true)
    }
    return []
  }
}
