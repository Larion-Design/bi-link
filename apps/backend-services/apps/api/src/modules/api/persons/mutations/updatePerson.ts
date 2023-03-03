import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { Person } from '../dto/person'
import { PersonInput } from '../dto/personInput'
import { PersonAPIService } from '../services/personAPIService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/rpc/services/userActionsService'
import { EntityEventsService } from '@app/rpc/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { User, UserActions } from 'defs'
import { getUnixTime } from 'date-fns'

@ArgsType()
class Params {
  @Field()
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
  async updatePerson(@CurrentUser() { _id }: User, @Args() { personId, personInfo }: Params) {
    const updated = await this.personsService.update(personId, personInfo)

    if (updated) {
      this.entityEventsService.emitEntityModified({
        entityId: personId,
        entityType: 'PERSON',
      })

      this.userActionsService.recordAction({
        eventType: UserActions.ENTITY_UPDATED,
        author: _id,
        timestamp: getUnixTime(new Date()),
        target: personId,
        targetType: 'PERSON',
      })
    }
    return updated
  }
}
