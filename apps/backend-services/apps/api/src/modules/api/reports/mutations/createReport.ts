import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { User } from 'defs'
import { IngressService } from '@app/rpc/microservices/ingress'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'
import { ReportInput } from '../dto/reportInput'

@ArgsType()
class Params {
  @Field(() => ReportInput)
  data: ReportInput
}

@Resolver(() => Report)
export class CreateReport {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createReport(@CurrentUser() { _id }: User, @Args() { data }: Params) {
    return this.ingressService.createEntity('REPORT', data, {
      type: 'USER',
      sourceId: _id,
    })
  }
}
