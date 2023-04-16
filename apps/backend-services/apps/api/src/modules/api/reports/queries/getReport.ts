import { IngressService } from '@app/rpc/microservices/ingress'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'

@ArgsType()
class Params {
  @Field(() => ID)
  id: string
}

@Resolver(() => Report)
export class GetReport {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => Report)
  @UseGuards(FirebaseAuthGuard)
  async getReport(@CurrentUser() { _id }: User, @Args() { id }: Params) {
    return this.ingressService.getEntity(
      {
        entityId: id,
        entityType: 'REPORT',
      },
      true,
      {
        sourceId: _id,
        type: 'USER',
      },
    )
  }
}
