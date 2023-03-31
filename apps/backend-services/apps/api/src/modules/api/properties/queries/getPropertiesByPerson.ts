import { GraphService } from '@app/rpc/microservices/graph/graphService'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { Property } from '../dto/property'
import { PropertyListRecord } from '../dto/propertyListRecord'

@ArgsType()
class Params {
  @Field()
  personId: string
}

@Resolver(() => Property)
export class GetPropertiesByPerson {
  constructor(private readonly graphService: GraphService) {}

  @Query(() => [PropertyListRecord])
  async getPropertiesByPerson(@Args() { personId }: Params) {
    return []
  }
}
