import { Query, Resolver } from '@nestjs/graphql'
import { CustomField } from '../../customFields/dto/customField'
import { FrequentCustomFieldsService } from '../../../search/services/frequentCustomFieldsService'
import { INDEX_COMPANIES } from '@app/definitions'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@Resolver(() => CustomField)
export class GetCompanyFrequentCustomFields {
  constructor(private readonly frequentCustomFieldsService: FrequentCustomFieldsService) {}

  @Query(() => [String], { nullable: false })
  @UseGuards(FirebaseAuthGuard)
  async getCompanyFrequentCustomFields() {
    return this.frequentCustomFieldsService.getFrequentlyCustomFields(INDEX_COMPANIES)
  }
}
