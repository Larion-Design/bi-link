import { Args, ArgsType, Field, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { EntityEventsService } from '@app/pub/services/entityEventsService'
import { CompanyInput } from '../dto/companyInput'
import { Company } from '../dto/company'
import { CompanyAPIService } from '../services/companyAPIService'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { UserActionsService } from '@app/pub/services/userActionsService'
import { User, UserActions } from '@app/definitions/user'
import { getUnixTime } from 'date-fns'

@ArgsType()
class CreateCompanyArgs {
  @Field(() => CompanyInput)
  data: CompanyInput
}

@Resolver(() => Company)
export class CreateCompany {
  constructor(
    private readonly companyService: CompanyAPIService,
    private readonly userActionsService: UserActionsService,
    private readonly entityEventsService: EntityEventsService,
  ) {}

  @Mutation(() => String)
  @UseGuards(FirebaseAuthGuard)
  async createCompany(@CurrentUser() { _id }: User, @Args() { data }: CreateCompanyArgs) {
    const companyId = await this.companyService.create(data)

    this.entityEventsService.emitEntityCreated({
      entityId: companyId,
      entityType: 'COMPANY',
    })

    this.userActionsService.recordAction({
      eventType: UserActions.ENTITY_CREATED,
      author: _id,
      timestamp: getUnixTime(new Date()),
      target: companyId,
      targetType: 'COMPANY',
    })
    return companyId
  }
}
