import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { CompanyInput } from '../dto/companyInput'
import { Company } from '../dto/company'
import { CompanyAPIService } from '../services/companyAPIService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/rpc/services/userActionsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { EntityEventsService } from '@app/rpc/services/entityEventsService'
import { EntityInfo, User, UserActions } from 'defs'
import { getUnixTime } from 'date-fns'

@ArgsType()
class UpdateCompanyArgs {
  @Field(() => ID)
  companyId: string

  @Field(() => CompanyInput)
  companyInfo: CompanyInput
}

@Resolver(() => Company)
export class UpdateCompany {
  constructor(
    private readonly companyService: CompanyAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(FirebaseAuthGuard)
  async updateCompany(
    @CurrentUser() { _id }: User,
    @Args() { companyId, companyInfo }: UpdateCompanyArgs,
  ) {
    const updated = await this.companyService.update(companyId, companyInfo)

    if (updated) {
      const entityInfo: EntityInfo = {
        entityId: companyId,
        entityType: 'COMPANY',
      }

      this.entityEventsService.emitEntityModified(entityInfo)

      this.userActionsService.recordAction({
        eventType: UserActions.ENTITY_UPDATED,
        author: _id,
        timestamp: getUnixTime(new Date()),
        targetEntityInfo: entityInfo,
      })
    }
    return updated
  }
}
