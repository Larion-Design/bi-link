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
  @Field(() => ID)
  proceedingId: string

  @Field(() => ProceedingInput)
  data: ProceedingInput
}

@Resolver(() => Proceeding)
export class UpdateProceeding {
  constructor(
    private readonly proceedingAPIService: ProceedingAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async updateProceeding(@CurrentUser() { _id }: User, @Args() { proceedingId, data }: Params) {
    const updated = await this.proceedingAPIService.update(proceedingId, data)

    if (updated) {
      const entityInfo: EntityInfo = {
        entityId: proceedingId,
        entityType: 'PROCEEDING',
      }

      this.entityEventsService.emitEntityModified(entityInfo)

      this.userActionsService.recordAction({
        eventType: UserActions.ENTITY_UPDATED,
        author: _id,
        timestamp: getUnixTime(new Date()),
        targetEntityInfo: entityInfo,
      })

      return proceedingId
    }
  }
}
