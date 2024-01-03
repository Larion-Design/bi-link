import { ReportAPIService } from '@modules/central/schema/report/services/reportAPIService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser, FirebaseAuthGuard } from '@modules/iam'
import { Report } from '../dto/report'
import { ReportInput } from '../dto/reportInput'

@ArgsType()
class Params {
  @Field(() => ReportInput)
  data: ReportInput
}

@Resolver(() => Report)
export class CreateReport {
  constructor(private readonly reportsService: ReportAPIService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createReport(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.reportsService.createReport(data)
  }
}
