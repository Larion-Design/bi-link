import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { CompanyInput } from '../dto/companyInput'
import { Company } from '../dto/company'
import { CompanyAPIService } from '../services/companyAPIService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { UserActionsService } from '@app/pub/services/userActionsService'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { EntityEventsService } from '@app/pub/services/entityEventsService'
import { User, UserActions } from 'defs'
import { getUnixTime } from 'date-fns'

@ArgsType()
class UpdateCompanyArgs {
  @Field()
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
      this.entityEventsService.emitEntityModified({
        entityId: companyId,
        entityType: 'COMPANY',
      })

      this.userActionsService.recordAction({
        eventType: UserActions.ENTITY_UPDATED,
        author: _id,
        timestamp: getUnixTime(new Date()),
        target: companyId,
        targetType: 'COMPANY',
      })
    }
    return updated
  }
}
