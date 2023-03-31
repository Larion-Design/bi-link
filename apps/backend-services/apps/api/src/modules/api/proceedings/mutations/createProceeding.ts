import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Proceeding } from '../dto/proceeding'
import { ProceedingInput } from '../dto/proceedingInput'

@ArgsType()
class Params {
  @Field(() => ProceedingInput)
  data: ProceedingInput
}

@Resolver(() => Proceeding)
export class CreateProceeding {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createProceeding(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.ingressService.createEntity('PROCEEDING', data, {
      sourceId: _id,
      type: 'USER',
    })
  }
}
