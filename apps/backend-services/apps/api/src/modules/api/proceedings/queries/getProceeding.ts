import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Proceeding } from '../dto/proceeding'

@ArgsType()
class Params {
  @Field(() => ID)
  proceedingId: string
}

@Resolver(() => Proceeding)
export class GetProceeding {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => Proceeding)
  @UseGuards(FirebaseAuthGuard)
  async getProceeding(@CurrentUser() { _id }: User, @Args() { proceedingId }: Params) {
    return this.ingressService.getEntity(
      { entityId: proceedingId, entityType: 'PROCEEDING' },
      true,
      {
        type: 'USER',
        sourceId: _id,
      },
    )
  }
}
