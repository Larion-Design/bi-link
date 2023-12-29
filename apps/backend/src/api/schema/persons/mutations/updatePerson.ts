import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { PersonsService } from '@modules/central/schema/person/services/personsService'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Person } from '../dto/person'
import { PersonInput } from '../dto/personInput'
import { UseGuards } from '@nestjs/common'
import { EntityInfo, UpdateSource, User } from 'defs'

@ArgsType()
class Params {
  @Field(() => ID)
  personId: string

  @Field(() => PersonInput)
  personInfo: PersonInput
}

@Resolver(() => Person)
export class UpdatePerson {
  constructor(private readonly ingressService: PersonsService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updatePerson(@CurrentUser() { _id, role }: User, @Args() { personId, personInfo }: Params) {
    await this.ingressService.update(personId, personInfo)
    return true
  }
}
