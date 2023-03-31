import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { EntityInfo, UpdateSource, User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Proceeding } from '../dto/proceeding'
import { ProceedingInput } from '../dto/proceedingInput'

@ArgsType()
class Params {
  @Field(() => ID)
  proceedingId: string

  @Field(() => ProceedingInput)
  data: ProceedingInput
}

@Resolver(() => Proceeding)
export class UpdateProceeding {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateProceeding(
    @CurrentUser() { _id, role }: User,
    @Args() { proceedingId, data }: Params,
  ) {
    const entityInfo: EntityInfo = {
      entityId: proceedingId,
      entityType: 'PROCEEDING',
    }

    const author: UpdateSource = {
      type: 'USER',
      sourceId: _id,
    }

    if (role === 'ADMIN') {
      await this.ingressService.createHistorySnapshot(entityInfo, author)
      await this.ingressService.updateEntity(entityInfo, data, author)
      return proceedingId
    } else {
      return this.ingressService.createPendingSnapshot(entityInfo, data, author)
    }
  }
}
