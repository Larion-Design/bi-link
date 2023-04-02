import { IngressService } from '@app/rpc/microservices/ingress'
import { UseGuards } from '@nestjs/common'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { EntityInfo, UpdateSource, User } from 'defs'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { Report } from '../dto/report'
import { ReportInput } from '../dto/reportInput'

@ArgsType()
class Params {
  @Field(() => ID)
  reportId: string

  @Field(() => ReportInput)
  data: ReportInput
}

@Resolver(() => Report)
export class UpdateReport {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateReport(@CurrentUser() { _id, role }: User, @Args() { reportId, data }: Params) {
    const entityInfo: EntityInfo = {
      entityId: reportId,
      entityType: 'REPORT',
    }

    const author: UpdateSource = {
      type: 'USER',
      sourceId: _id,
    }

    if (role === 'ADMIN') {
      await this.ingressService.createHistorySnapshot(entityInfo, author)
      return this.ingressService.updateEntity(entityInfo, data, author)
    } else {
      await this.ingressService.createPendingSnapshot(entityInfo, data, author)
      return true
    }
  }
}
