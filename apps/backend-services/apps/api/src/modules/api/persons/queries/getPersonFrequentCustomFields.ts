import { Query, Resolver } from '@nestjs/graphql'
import { CustomField } from '../../customFields/dto/customField'
import { FrequentCustomFieldsService } from '../../../search/services/frequentCustomFieldsService'
import { INDEX_PERSONS } from '@app/definitions/constants'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'

@Resolver(() => CustomField)
export class GetPersonFrequentCustomFields {
  constructor(private readonly frequentCustomFieldsService: FrequentCustomFieldsService) {}

  @Query(() => [String], { nullable: false })
  @UseGuards(FirebaseAuthGuard)
  async getPersonFrequentCustomFields() {
    return this.frequentCustomFieldsService.getFrequentlyCustomFields(INDEX_PERSONS)
  }
}
