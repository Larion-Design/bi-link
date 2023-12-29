import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { GraphService } from '@modules/graph/services/graphService'
import { Property } from '../dto/property'
import { PropertyListRecord } from '../dto/propertyListRecord'

@ArgsType()
class Params {
  @Field(() => ID)
  personId: string
}

@Resolver(() => Property)
export class GetPropertiesByPerson {
  constructor(private readonly graphService: GraphService) {}

  @Query(() => [PropertyListRecord])
  async getPropertiesByPerson(@Args() { personId }: Params) {
    const graph = await this.graphService.getEntitiesGraph(personId, 1)
    return []
  }
}
