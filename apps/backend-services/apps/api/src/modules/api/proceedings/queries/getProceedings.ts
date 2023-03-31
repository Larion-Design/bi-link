import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { IngressService } from '@app/rpc/microservices/ingress'
import { User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Proceeding } from '../dto/proceeding'

@ArgsType()
class Params {
  @Field(() => [ID])
  proceedingsIds: string[]
}

@Resolver(() => Proceeding)
export class GetProceedings {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => [Proceeding])
  @UseGuards(FirebaseAuthGuard)
  async getProceedings(@CurrentUser() { _id }: User, @Args() { proceedingsIds }: Params) {
    return this.ingressService.getEntities(proceedingsIds, 'PROCEEDING', true, {
      type: 'USER',
      sourceId: _id,
    })
  }
}
