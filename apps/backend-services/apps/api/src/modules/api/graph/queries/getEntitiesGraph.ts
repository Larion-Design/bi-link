import { Args, ArgsType, Field, Int, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { EntitiesGraph } from '../dto/entitiesGraph'
import { GraphService } from '@app/rpc/microservices/graph/graphService'

@ArgsType()
class Params {
  @Field()
  readonly id: string

  @Field(() => Int)
  readonly depth: number
}

@Resolver(() => EntitiesGraph)
export class GetEntitiesGraph {
  constructor(private readonly graphService: GraphService) {}

  @Query(() => EntitiesGraph)
  @UseGuards(FirebaseAuthGuard)
  async getEntitiesGraph(@Args() { id, depth }: Params): Promise<EntitiesGraph> {
    return this.graphService.getEntityRelationships(id, depth)
  }
}
