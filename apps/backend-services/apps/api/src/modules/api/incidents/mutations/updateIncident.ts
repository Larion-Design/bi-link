import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { IncidentInput } from '../dto/incidentInput'
import { Incident } from '../dto/incident'
import { IncidentAPIService } from '../services/incidentAPIService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/pub/services/userActionsService'
import { EntityEventsService } from '@app/pub/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { User, UserActions } from '@app/definitions/user'
import { Roles } from '../../../users/decorators/roles'
import { Role } from '../../../users/constants'
import { RolesGuard } from '../../../users/guards/RolesGuard'
import { getUnixTime } from 'date-fns'

@ArgsType()
class UpdateIncidentArgs {
  @Field()
  incidentId: string

  @Field(() => IncidentInput)
  data: IncidentInput
}

@Resolver(() => Incident)
export class UpdateIncident {
  constructor(
    private readonly incidentAPIService: IncidentAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => String)
  @Roles(Role.ADMIN)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  async updateIncident(
    @CurrentUser() { _id }: User,
    @Args() { incidentId, data }: UpdateIncidentArgs,
  ) {
    const updated = await this.incidentAPIService.update(incidentId, data)

    if (updated) {
      this.entityEventsService.emitEntityModified({
        entityId: incidentId,
        entityType: 'INCIDENT',
      })

      this.userActionsService.recordAction({
        eventType: UserActions.ENTITY_UPDATED,
        author: _id,
        timestamp: getUnixTime(new Date()),
        target: incidentId,
        targetType: 'INCIDENT',
      })
    }
    return incidentId
  }
}
