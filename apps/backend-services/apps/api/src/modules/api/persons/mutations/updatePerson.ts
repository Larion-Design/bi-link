import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { Person } from '../dto/person'
import { PersonInput } from '../dto/personInput'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { EntityInfo, UpdateSource, User } from 'defs'

@ArgsType()
class Params {
  @Field(() => ID)
  personId: string

  @Field(() => PersonInput)
  personInfo: PersonInput
}

@Resolver(() => Person)
export class UpdatePerson {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updatePerson(@CurrentUser() { _id, role }: User, @Args() { personId, personInfo }: Params) {
    const entityInfo: EntityInfo = {
      entityId: personId,
      entityType: 'PERSON',
    }

    const author: UpdateSource = {
      type: 'USER',
      sourceId: _id,
    }

    if (role === 'ADMIN') {
      await this.ingressService.createHistorySnapshot(entityInfo, author)
      return this.ingressService.updateEntity(entityInfo, personInfo, author)
    } else {
      await this.ingressService.createPendingSnapshot(entityInfo, personInfo, author)
      return true
    }
  }
}
