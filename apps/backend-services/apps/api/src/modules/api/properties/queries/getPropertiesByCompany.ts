import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { Property } from '../dto/property'
import { PropertyListRecord } from '../dto/propertyListRecord'

@ArgsType()
class Params {
  @Field(() => ID)
  companyId: string
}

@Resolver(() => Property)
export class GetPropertiesByCompany {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => [PropertyListRecord])
  async getPropertiesByCompany(@Args() { companyId }: Params) {
    return Promise.resolve([])
  }
}
