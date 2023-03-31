import { IngressService } from '@app/rpc/microservices/ingress'
import { Args, ArgsType, Field, ID, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { CompanyInput } from '../dto/companyInput'
import { Company } from '../dto/company'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { CurrentUser } from '../../../users/decorators/currentUser'
import { User } from 'defs'

@ArgsType()
class CreateCompanyArgs {
  @Field(() => CompanyInput)
  data: CompanyInput
}

@Resolver(() => Company)
export class CreateCompany {
  constructor(private readonly ingressService: IngressService) {}

  @Mutation(() => ID)
  @UseGuards(FirebaseAuthGuard)
  async createCompany(@CurrentUser() { _id }: User, @Args() { data }: CreateCompanyArgs) {
    return this.ingressService.createEntity('COMPANY', data, {
      sourceId: _id,
      type: 'USER',
    })
  }
}
