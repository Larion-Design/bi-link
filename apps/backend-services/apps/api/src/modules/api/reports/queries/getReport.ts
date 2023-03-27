import { ReportsService } from '@app/models/services/reportsService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'

@ArgsType()
class Params {
  @Field()
  id: string
}

@Resolver(() => Report)
export class GetReport {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => Report)
  @UseGuards(FirebaseAuthGuard)
  async getReport(@Args() { id }: Params) {
    return this.reportsService.getReport(id, true)
  }
}
