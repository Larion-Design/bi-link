import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { PersonsService } from '@modules/central/schema/person/services/personsService'
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
  constructor(private readonly ingressService: PersonsService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createPerson(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.ingressService.create(data)
  }
}
