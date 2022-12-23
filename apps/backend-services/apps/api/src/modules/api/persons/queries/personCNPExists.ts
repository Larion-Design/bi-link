import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { Person } from '../dto/person'
import { SearchPersonsService } from '../../../search/services/searchPersonsService'
import { IsMongoId, IsOptional } from 'class-validator'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field()
  cnp: string

  @IsOptional()
  @IsMongoId()
  @Field({ nullable: true })
  personId?: string
}

@Resolver(() => Person)
export class PersonCNPExists {
  constructor(private readonly searchPersonsService: SearchPersonsService) {}

  @Query(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async personCNPExists(@Args() { cnp, personId }: Params) {
    return this.searchPersonsService.cnpExists(cnp, personId)
  }
}
