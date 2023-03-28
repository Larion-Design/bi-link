import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { ReportsService } from '@app/models/report/services/reportsService'
import { EntityType } from 'defs'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'

@ArgsType()
class Params {
  @Field(() => ID)
  entityId: string

  @Field(() => String)
  entityType: EntityType
}

@Resolver(() => Report)
export class GetReports {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => [Report])
  @UseGuards(FirebaseAuthGuard)
  async getReports(@Args() { entityId, entityType }: Params) {
    return this.reportsService.getEntityReports({ entityId, entityType })
  }
}
