import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { CompanyInput } from '../dto/companyInput'
import { Company } from '../dto/company'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { EntityInfo, UpdateSource, User } from 'defs'

@ArgsType()
class UpdateCompanyArgs {
  @Field(() => ID)
  companyId: string

  @Field(() => CompanyInput)
  companyInfo: CompanyInput
}

@Resolver(() => Company)
export class UpdateCompany {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateCompany(
    @CurrentUser() { _id, role }: User,
    @Args() { companyId, companyInfo }: UpdateCompanyArgs,
  ) {
    const author: UpdateSource = {
      sourceId: _id,
      type: 'USER',
    }

    const entityInfo: EntityInfo = {
      entityId: companyId,
      entityType: 'COMPANY',
    }

    if (role !== 'ADMIN') {
      return this.ingressService.createPendingSnapshot(entityInfo, companyInfo, author)
    } else {
      return this.ingressService.updateEntity(entityInfo, companyInfo, author)
    }
  }
}
