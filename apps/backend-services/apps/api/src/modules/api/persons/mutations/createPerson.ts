import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { EntityInfo, User, UserActions } from 'defs'
import { Person } from '../dto/person'
import { PersonInput } from '../dto/personInput'
import { PersonAPIService } from '../services/personAPIService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/rpc/services/userActionsService'
import { EntityEventsService } from '@app/rpc/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { getUnixTime } from 'date-fns'

@ArgsType()
class Params {
  @Field(() => PersonInput)
  data: PersonInput
}

@Resolver(() => Person)
export class CreatePerson {
  constructor(
    private readonly personsAPIService: PersonAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createPerson(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    const personId = await this.personsAPIService.create(data)

    const entityInfo: EntityInfo = {
      entityId: personId,
      entityType: 'PERSON',
    }

    this.entityEventsService.emitEntityCreated(entityInfo)

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      targetEntityInfo: entityInfo,
    })
    return personId
  }
}
