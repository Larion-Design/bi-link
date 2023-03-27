import { PersonsService } from '@app/models/services/personsService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Person } from '../dto/person'

@ArgsType()
class Params {
  @Field(() => ID)
  id: string
}

@Resolver(() => Person)
export class GetPerson {
  constructor(private readonly personsService: PersonsService) {}

  @Query(() => Person)
  @UseGuards(FirebaseAuthGuard)
  async getPersonInfo(@Args() { id }: Params) {
    return this.personsService.find(id, true)
  }
}
