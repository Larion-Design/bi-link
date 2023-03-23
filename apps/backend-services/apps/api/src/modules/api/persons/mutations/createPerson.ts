import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User, UserActions } from 'defs'
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

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async createPerson(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    const personId = await this.personsAPIService.create(data)

    this.entityEventsService.emitEntityCreated({
      entityId: personId,
      entityType: 'PERSON',
    })

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      target: personId,
      targetType: 'PERSON',
    })
    return personId
  }
}
