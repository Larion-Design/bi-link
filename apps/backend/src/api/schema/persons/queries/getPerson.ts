import { UseGuards } from '@nestjs/common';
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql';
import { PersonsService } from '@modules/central/schema/person/services/personsService';
import { User } from 'defs';
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam';
import { Person } from '../dto/person';

@ArgsType()
class Params {
  @Field(() => ID)
  id: string;
}

@Resolver(() => Person)
export class GetPerson {
  constructor(private readonly ingressService: PersonsService) {}

  @Query(() => Person)
  @UseGuards(FirebaseAuthGuard)
  async getPersonInfo(@CurrentUser() { _id }: User, @Args() { id }: Params) {
    return this.ingressService.find(id, true);
  }
}
