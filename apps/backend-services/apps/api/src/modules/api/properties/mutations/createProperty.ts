import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { Property } from '../dto/property'
import { PropertyInput } from '../dto/propertyInput'
import { UserActionsService } from '@app/rpc/services/userActionsService'
import { EntityEventsService } from '@app/rpc/services/entityEventsService'
import { PropertyAPIService } from '../services/propertyAPIService'
import { EntityInfo, User, UserActions } from 'defs'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { getUnixTime } from 'date-fns'

@ArgsType()
class Params {
  @Field(() => PropertyInput)
  data: PropertyInput
}

@Resolver(() => Property)
export class CreateProperty {
  constructor(
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
    private readonly propertyAPIService: PropertyAPIService,
  ) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createProperty(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    const propertyId = await this.propertyAPIService.createProperty(data)

    const entityInfo: EntityInfo = {
      entityId: propertyId,
      entityType: 'PROPERTY',
    }

    this.entityEventsService.emitEntityCreated(entityInfo)

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      targetEntityInfo: entityInfo,
    })

    return propertyId
  }
}
