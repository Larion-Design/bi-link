import { Args, ArgsType, Field, Int, Query, Resolver } from '@nestjs/graphql'
import { IsMongoId } from 'class-validator'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { GraphService } from '@app/graph-module/graphService'
import { EntitiesGraph } from '../dto/graph/entitiesGraph'

@ArgsType()
class Params {
  @IsMongoId()
  @Field()
  readonly id: string

  @Field(() => Int)
  readonly depth: number
}

@Resolver(() => EntitiesGraph)
export class GetEntitiesGraph {
  constructor(protected readonly graphService: GraphService) {}

  @Query(() => EntitiesGraph)
  @UseGuards(FirebaseAuthGuard)
  async getEntitiesGraph(@Args() { id, depth }: Params): Promise<EntitiesGraph> {
    return this.graphService.getEntitiesGraph(id, depth)
  }
}
