import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { IsMongoId } from 'class-validator'
import { ReportsService } from '@app/entities/services/reportsService'
import { EntityType } from 'defs'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'

@ArgsType()
class Params {
  @IsMongoId()
  @Field()
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
