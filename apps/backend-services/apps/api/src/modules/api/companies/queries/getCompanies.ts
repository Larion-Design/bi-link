import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { Company } from '../dto/company'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => [ID])
  companiesIds: string[]
}

@Resolver(() => Company)
export class GetCompanies {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => [Company])
  @UseGuards(FirebaseAuthGuard)
  async getCompanies(@CurrentUser() { _id }: User, @Args() { companiesIds }: Params) {
    if (companiesIds.length) {
      return this.ingressService.getEntities(companiesIds, 'COMPANY', true, {
        sourceId: _id,
        type: 'USER',
      })
    }
    return []
  }
}
