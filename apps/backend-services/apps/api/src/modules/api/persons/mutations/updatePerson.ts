import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { Person } from '../dto/person'
import { PersonInput } from '../dto/personInput'
import { PersonAPIService } from '../services/personAPIService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/rpc/services/userActionsService'
import { EntityEventsService } from '@app/rpc/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { EntityInfo, Role, User, UserActions } from 'defs'
import { getUnixTime } from 'date-fns'

@ArgsType()
class Params {
  @Field(() => ID)
  personId: string

  @Field(() => PersonInput)
  personInfo: PersonInput
}

@Resolver(() => Person)
export class UpdatePerson {
  constructor(
    private readonly personsService: PersonAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updatePerson(@CurrentUser() { _id, role }: User, @Args() { personId, personInfo }: Params) {
    if (role === Role.ADMIN) {
      await this.personsService.createHistorySnapshot(personId, {
        type: 'USER',
        sourceId: _id,
      })

      const updated = await this.personsService.update(personId, personInfo)

      if (updated) {
        const entityInfo: EntityInfo = {
          entityId: personId,
          entityType: 'PERSON',
        }

        this.entityEventsService.emitEntityModified(entityInfo)

        this.userActionsService.recordAction({
          eventType: UserActions.ENTITY_UPDATED,
          author: _id,
          timestamp: getUnixTime(new Date()),
          targetEntityInfo: entityInfo,
        })
      }
      return updated
    } else {
      await this.personsService.createPendingSnapshot(personId, personInfo, {
        type: 'USER',
        sourceId: _id,
      })
      return true
    }
  }
}
