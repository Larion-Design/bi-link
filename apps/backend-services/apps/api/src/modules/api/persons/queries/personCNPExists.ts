import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { Person } from '../dto/person'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field()
  cnp: string

  @Field(() => ID, { nullable: true })
  personId?: string
}

@Resolver(() => Person)
export class PersonCNPExists {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async personCNPExists(@Args() { cnp, personId }: Params) {
    return this.indexerService.personCNPExists(cnp, personId)
  }
}
