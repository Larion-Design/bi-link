import { EntityEventsService, UserActionsService } from '@app/rpc'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { getUnixTime } from 'date-fns'
import { EntityInfo, User, UserActions } from 'defs'
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

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createProceeding(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    const proceedingId = await this.proceedingAPIService.create(data)

    const entityInfo: EntityInfo = {
      entityId: proceedingId,
      entityType: 'PROCEEDING',
    }

    this.entityEventsService.emitEntityCreated(entityInfo)

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      targetEntityInfo: entityInfo,
    })

    return proceedingId
  }
}
