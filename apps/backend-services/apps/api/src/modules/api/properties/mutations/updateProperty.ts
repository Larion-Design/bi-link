import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { User, UserActions } from '@app/definitions/user'
import { UserActionsService } from '@app/pub/services/userActionsService'
import { EntityEventsService } from '@app/pub/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { Roles } from '../../../users/decorators/roles'
import { Role } from '../../../users/constants'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { RolesGuard } from '../../../users/guards/RolesGuard'
import { PropertyInput } from '../dto/propertyInput'
import { Property } from '../dto/property'
import { PropertyAPIService } from '../services/propertyAPIService'
import { getUnixTime } from 'date-fns'

@ArgsType()
class Params {
  @Field()
  propertyId: string

  @Field(() => PropertyInput)
  data: PropertyInput
}

@Resolver(() => Property)
export class UpdateProperty {
  constructor(
    private readonly propertyAPIService: PropertyAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  @UseGuards(FirebaseAuthGuard, RolesGuard)
  async updateProperty(@CurrentUser() { _id }: User, @Args() { propertyId, data }: Params) {
    const propertyUpdated = await this.propertyAPIService.updateProperty(propertyId, data)

    if (propertyUpdated) {
      this.entityEventsService.emitEntityModified({
        entityId: propertyId,
        entityType: 'PROPERTY',
      })

      this.userActionsService.recordAction({
        eventType: UserActions.ENTITY_UPDATED,
        author: _id,
        timestamp: getUnixTime(new Date()),
        target: propertyId,
        targetType: 'PROPERTY',
      })
    }
    return propertyUpdated
  }
}
