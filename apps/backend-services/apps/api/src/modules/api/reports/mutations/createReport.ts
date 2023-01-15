import { EntityEventsService } from '@app/pub/services/entityEventsService'
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
  @Field(() => ReportInput)
  data: ReportInput
}

@Resolver(() => Report)
export class CreateReport {
  constructor(
    private readonly reportAPIService: ReportAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async createReport(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    const reportId = await this.reportAPIService.createReport(data)

    this.entityEventsService.emitEntityCreated({
      entityId: reportId,
      entityType: 'REPORT',
    })

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      target: reportId,
      targetType: 'REPORT',
    })
    return reportId
  }
}
