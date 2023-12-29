import { ReportAPIService } from '@modules/central/schema/report/services/reportAPIService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { ReportsService } from '@modules/central/schema/report/services/reportsService'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Report } from '../dto/report'
import { ReportInput } from '../dto/reportInput'

@ArgsType()
class Params {
  @Field(() => ID)
  reportId: string

  @Field(() => ReportInput)
  data: ReportInput
}

@Resolver(() => Report)
export class UpdateReport {
  constructor(private readonly reportsService: ReportAPIService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateReport(@CurrentUser() { _id }: User, @Args() { reportId, data }: Params) {
    await this.reportsService.updateReport(reportId, data)
    return true
  }
}
