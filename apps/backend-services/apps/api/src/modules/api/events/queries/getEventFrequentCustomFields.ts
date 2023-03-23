import { Query, Resolver } from '@nestjs/graphql'
import { FrequentCustomFieldsService } from '../../../search/services/frequentCustomFieldsService'
import { UseGuards } from '@nestjs/common'
import { FirebaseAuthGuard } from '../../../users/guards/FirebaseAuthGuard'
import { INDEX_EVENTS } from '@app/definitions'
import { Event } from '../dto/event'

@Resolver(() => Event)
export class GetEventFrequentCustomFields {
  constructor(private readonly frequentCustomFieldsService: FrequentCustomFieldsService) {}

  @Query(() => [String], { nullable: false })
  @UseGuards(FirebaseAuthGuard)
  async getEventFrequentCustomFields() {
    return this.frequentCustomFieldsService.getFrequentlyCustomFields(INDEX_EVENTS)
  }
}
