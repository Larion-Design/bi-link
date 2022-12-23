import { Query, Resolver } from '@nestjs/graphql'
import { FrequentCustomFieldsService } from '../../../search/services/frequentCustomFieldsService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { INDEX_INCIDENTS } from '@app/definitions/constants'
import { Incident } from '../dto/incident'

@Resolver(() => Incident)
export class GetIncidentFrequentCustomFields {
  constructor(private readonly frequentCustomFieldsService: FrequentCustomFieldsService) {}

  @Query(() => [String], { nullable: false })
  @UseGuards(FirebaseAuthGuard)
  async getIncidentFrequentCustomFields() {
    return this.frequentCustomFieldsService.getFrequentlyCustomFields(INDEX_INCIDENTS)
  }
}
