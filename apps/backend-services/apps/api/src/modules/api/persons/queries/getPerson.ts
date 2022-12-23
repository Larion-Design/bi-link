import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { Person } from '../dto/person'
import { IsMongoId } from 'class-validator'
import { PersonsService } from '@app/entities/services/personsService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @IsMongoId()
  @Field()
  id: string
}

@Resolver(() => Person)
export class GetPerson {
  constructor(protected personsService: PersonsService) {}

  @Query(() => Person)
  @UseGuards(FirebaseAuthGuard)
  async getPersonInfo(@Args() { id }: Params) {
    return this.personsService.find(id)
  }
}
