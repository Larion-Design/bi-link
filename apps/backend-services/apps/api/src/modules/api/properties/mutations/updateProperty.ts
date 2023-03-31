import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { EntityInfo, UpdateSource, User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { PropertyInput } from '../dto/propertyInput'
import { Property } from '../dto/property'

@ArgsType()
class Params {
  @Field(() => ID)
  propertyId: string

  @Field(() => PropertyInput)
  data: PropertyInput
}

@Resolver(() => Property)
export class UpdateProperty {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateProperty(@CurrentUser() { _id, role }: User, @Args() { propertyId, data }: Params) {
    const entityInfo: EntityInfo = {
      entityId: propertyId,
      entityType: 'PROPERTY',
    }

    const author: UpdateSource = {
      type: 'USER',
      sourceId: _id,
    }

    if (role === 'ADMIN') {
      await this.ingressService.createHistorySnapshot(entityInfo, author)
      return this.ingressService.updateEntity(entityInfo, data, author)
    } else {
      await this.ingressService.createPendingSnapshot(entityInfo, data, author)
      return true
    }
  }
}
