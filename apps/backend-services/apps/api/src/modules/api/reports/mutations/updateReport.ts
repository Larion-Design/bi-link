import { UserActionsService } from '@app/pub/services/userActionsService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { getUnixTime } from 'date-fns'
import { User, UserActions } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'
import { ReportInput } from '../dto/reportInput'
import { ReportAPIService } from '../services/reportAPIService'

@ArgsType()
class Params {
  @Field()
  reportId: string

  @Field(() => ReportInput)
  data: ReportInput
}

@Resolver(() => Report)
export class UpdateReport {
  constructor(
    private readonly reportAPIService: ReportAPIService,
    private readonly userActionsService: UserActionsService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateReport(@CurrentUser() { _id }: User, @Args() { reportId, data }: Params) {
    const updated = await this.reportAPIService.updateReport(reportId, data)

    if (updated) {
      this.userActionsService.recordAction({
        eventType: UserActions.ENTITY_UPDATED,
        author: _id,
        timestamp: getUnixTime(new Date()),
        target: reportId,
        targetType: 'REPORT',
      })
    }
    return updated
  }
}
