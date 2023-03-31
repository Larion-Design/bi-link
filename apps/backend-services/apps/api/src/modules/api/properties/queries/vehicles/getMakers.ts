import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { FirebaseAuthGuard } from '../../../../users/guards/FirebaseAuthGuard'
import { Property } from '../../dto/property'

@ArgsType()
class Params {
  @Field({ nullable: true })
  model?: string
}

@Resolver(() => Property)
export class GetMakers {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => [String])
  @UseGuards(FirebaseAuthGuard)
  async getMakers(@Args() { model }: Params) {
    return []
  }
}
