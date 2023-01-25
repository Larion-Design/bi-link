import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { SearchPropertiesService } from '../../../search/services/searchPropertiesService'
import { Property } from '../dto/property'
import { PropertyListRecord } from '../dto/propertyListRecord'

@ArgsType()
class Params {
  @Field()
  companyId: string
}

@Resolver(() => Property)
export class GetPropertiesByCompany {
  constructor(private readonly searchPropertiesService: SearchPropertiesService) {}

  @Query(() => [PropertyListRecord])
  async getPropertiesByCompany(@Args() { companyId }: Params) {
    return this.searchPropertiesService.getPropertiesByCompany(companyId)
  }
}
