import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { SearchPropertiesService } from '../../../search/services/searchPropertiesService'
import { Property } from '../dto/property'
import { PropertyListRecord } from '../dto/propertyListRecord'

@ArgsType()
class Params {
  @Field()
  personId: string
}

@Resolver(() => Property)
export class GetPropertiesByPerson {
  constructor(private readonly searchPropertiesService: SearchPropertiesService) {}

  @Query(() => [PropertyListRecord])
  async getPropertiesByPerson(@Args() { personId }: Params) {
    return this.searchPropertiesService.getPropertiesByPerson(personId)
  }
}
