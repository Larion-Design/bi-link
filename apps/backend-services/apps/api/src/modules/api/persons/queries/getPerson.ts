import { PersonsService } from '@app/entities/services/personsService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { IsMongoId } from 'class-validator'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Person } from '../dto/person'

@ArgsType()
class Params {
  @IsMongoId()
  @Field()
  id: string
}

@Resolver(() => Person)
export class GetPerson {
  constructor(private readonly personsService: PersonsService) {}

  @Query(() => Person)
  @UseGuards(FirebaseAuthGuard)
  async getPersonInfo(@Args() { id }: Params) {
    return this.personsService.find(id)
  }
}
