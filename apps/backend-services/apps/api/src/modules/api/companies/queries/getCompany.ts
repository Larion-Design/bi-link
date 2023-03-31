import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { Company } from '../dto/company'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => ID)
  id: string
}

@Resolver(() => Company)
export class GetCompany {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => Company)
  @UseGuards(FirebaseAuthGuard)
  async getCompany(@CurrentUser() { _id }: User, @Args() { id }: Params) {
    return this.ingressService.getEntity(
      {
        entityId: id,
        entityType: 'COMPANY',
      },
      true,
      {
        type: 'USER',
        sourceId: _id,
      },
    )
  }
}
