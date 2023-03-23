import { EntityEventsService, UserActionsService } from '@app/rpc'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { getUnixTime } from 'date-fns'
import { User, UserActions } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Proceeding } from '../dto/proceeding'
import { ProceedingInput } from '../dto/proceedingInput'
import { ProceedingAPIService } from '../services/proceedingAPIService'

@ArgsType()
class Params {
  @Field(() => ProceedingInput)
  data: ProceedingInput
}

@Resolver(() => Proceeding)
export class CreateProceeding {
  constructor(
    private readonly proceedingAPIService: ProceedingAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async createProceeding(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    const proceedingId = await this.proceedingAPIService.create(data)

    this.entityEventsService.emitEntityCreated({
      entityId: proceedingId,
      entityType: 'PROCEEDING',
    })

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      target: proceedingId,
      targetType: 'PROCEEDING',
    })

    return proceedingId
  }
}
