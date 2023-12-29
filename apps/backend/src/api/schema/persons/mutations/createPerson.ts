import { PersonAPIService } from '@modules/central/schema/person/services/personAPIService'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'

import { Person } from '../dto/person'
import { PersonInput } from '../dto/personInput'

@ArgsType()
class Params {
  @Field(() => PersonInput)
  data: PersonInput
}

@Resolver(() => Person)
export class CreatePerson {
  constructor(private readonly personsService: PersonAPIService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createPerson(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.personsService.create(data)
  }
}
