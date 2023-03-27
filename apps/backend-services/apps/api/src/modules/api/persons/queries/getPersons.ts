import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { Person } from '../dto/person'
import { PersonsService } from '@app/models/services/personsService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => [ID])
  personsIds: string[]
}

@Resolver(() => Person)
export class GetPersons {
  constructor(protected personsService: PersonsService) {}

  @Query(() => [Person])
  @UseGuards(FirebaseAuthGuard)
  async getPersonsInfo(@Args() { personsIds }: Params) {
    return personsIds.length ? this.personsService.getPersons(personsIds, true) : []
  }
}
