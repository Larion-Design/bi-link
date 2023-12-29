import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { ReportsService } from '@modules/central/schema/report/services/reportsService'
import { EntityInfo, UpdateSource, User } from 'defs'
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
  constructor(private readonly ingressService: ReportsService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateReport(@CurrentUser() { _id, role }: User, @Args() { reportId, data }: Params) {
    await this.ingressService.updateReport(reportId, data)
    return true
  }
}
