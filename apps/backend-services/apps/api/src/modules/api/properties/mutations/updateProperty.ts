import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { User, UserActions } from 'defs'
import { UserActionsService } from '@app/pub/services/userActionsService'
import { EntityEventsService } from '@app/pub/services/entityEventsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
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
  @UseGuards(FirebaseAuthGuard)
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
