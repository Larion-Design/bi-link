import { IngressService } from '@app/rpc/microservices/ingress'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { EntityType, User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'

@ArgsType()
class Params {
  @Field(() => ID)
  entityId: string

  @Field(() => String)
  entityType: EntityType
}

@Resolver(() => Report)
export class GetReports {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => [Report])
  @UseGuards(FirebaseAuthGuard)
  async getReports(@CurrentUser() { _id }: User, @Args() { entityId, entityType }: Params) {
    return this.ingressService.getEntity({ entityId, entityType }, true, {
      sourceId: _id,
      type: 'USER',
    })
  }
}
