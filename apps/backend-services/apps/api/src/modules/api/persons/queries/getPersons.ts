import { IngressService } from '@app/rpc/microservices/ingress'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Query, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { Person } from '../dto/person'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@ArgsType()
class Params {
  @Field(() => [ID])
  personsIds: string[]
}

@Resolver(() => Person)
export class GetPersons {
  constructor(private readonly ingressService: IngressService) {}

  @Query(() => [Person])
  @UseGuards(FirebaseAuthGuard)
  async getPersonsInfo(@CurrentUser() { _id }: User, @Args() { personsIds }: Params) {
    if (personsIds.length) {
      return this.ingressService.getEntities(personsIds, 'PERSON', true, {
        type: 'USER',
        sourceId: _id,
      })
    }
    return []
  }
}
