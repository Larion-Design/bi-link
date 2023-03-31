import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { Property } from '../../dto/property'

@ArgsType()
class Params {
  @Field()
  vin: string

  @Field({ nullable: true })
  vehicleId?: string
}

@Resolver(() => Property)
export class VinExists {
  constructor(private readonly indexerService: IndexerService) {}

  @Query(() => Boolean)
  async vinExists(@Args() { vin, vehicleId }: Params) {
    return this.indexerService.vehicleVINExists(vin, vehicleId)
  }
}
