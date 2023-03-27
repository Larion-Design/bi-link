import { EntityEventsService } from '@app/rpc/services/entityEventsService'
import { UserActionsService } from '@app/rpc/services/userActionsService'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { getUnixTime } from 'date-fns'
import { EntityInfo, User, UserActions } from 'defs'
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

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createReport(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    const reportId = await this.reportAPIService.createReport(data)

    const entityInfo: EntityInfo = {
      entityId: reportId,
      entityType: 'REPORT',
    }

    this.entityEventsService.emitEntityCreated(entityInfo)

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      targetEntityInfo: entityInfo,
    })
    return reportId
  }
}
