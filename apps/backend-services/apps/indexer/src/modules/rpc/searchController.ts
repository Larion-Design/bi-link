import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { MICROSERVICES } from '@app/rpc'
import { IndexerServiceMethods } from '@app/rpc/microservices/indexer/indexerServiceConfig'
import {
  SearchCompaniesService,
  SearchEventsService,
  SearchFilesService,
  SearchPersonsService,
  SearchProceedingsService,
  SearchPropertiesService,
  SearchVehiclesService,
} from '../search/services'

@Controller()
export class SearchController {
  constructor(
    private readonly searchPersonsService: SearchPersonsService,
    private readonly searchCompaniesService: SearchCompaniesService,
    private readonly searchPropertiesService: SearchPropertiesService,
    private readonly searchEventsService: SearchEventsService,
    private readonly searchProceedingsService: SearchProceedingsService,
    private readonly searchVehiclesService: SearchVehiclesService,
    private readonly searchFilesService: SearchFilesService,
  ) {}

  @MessagePattern(MICROSERVICES.INDEXER.search)
  async search(
    @Payload()
    { entityType, searchTerm, limit, skip }: Parameters<IndexerServiceMethods['search']>[0],
  ) {
    switch (entityType) {
      case 'PERSON': {
        return this.searchPersonsService.searchBasicSuggestions(searchTerm, skip, limit)
      }
      case 'COMPANY': {
        return this.searchCompaniesService.searchBasicSuggestions(searchTerm, skip, limit)
      }
      case 'PROPERTY': {
        return this.searchPropertiesService.searchBasicSuggestions(searchTerm, skip, limit)
      }
      case 'EVENT': {
        return this.searchEventsService.searchBasicSuggestions(searchTerm, skip, limit)
      }
      case 'PROCEEDING': {
        return this.searchProceedingsService.searchProceedings(searchTerm, skip, limit)
      }
    }
  }

  @MessagePattern(MICROSERVICES.INDEXER.companyCUIExists)
  async companyCUIExists(
    @Payload()
    { cui, companyId }: Parameters<IndexerServiceMethods['companyCUIExists']>[0],
  ) {
    return this.searchCompaniesService.cuiExists(cui, companyId)
  }

  @MessagePattern(MICROSERVICES.INDEXER.companyRegistrationNumberExists)
  async companyRegistrationNumberExists(
    @Payload()
    {
      registrationNumber,
      companyId,
    }: Parameters<IndexerServiceMethods['companyRegistrationNumberExists']>[0],
  ) {
    return this.searchCompaniesService.registrationNumberExists(registrationNumber, companyId)
  }

  @MessagePattern(MICROSERVICES.INDEXER.personCNPExists)
  async personCNPExists(
    @Payload()
    { cnp, personId }: Parameters<IndexerServiceMethods['personCNPExists']>[0],
  ) {
    return this.searchPersonsService.cnpExists(cnp, personId)
  }

  @MessagePattern(MICROSERVICES.INDEXER.personIdDocumentExists)
  async personIdDocumentExists(
    @Payload()
    { documentNumber, personId }: Parameters<IndexerServiceMethods['personIdDocumentExists']>[0],
  ) {
    return this.searchPersonsService.idDocumentExists(documentNumber, personId)
  }

  @MessagePattern(MICROSERVICES.INDEXER.vehicleVINExists)
  async vehicleVINExists(
    @Payload()
    { vin, propertyId }: Parameters<IndexerServiceMethods['vehicleVINExists']>[0],
  ) {
    return this.searchVehiclesService.vinExists(vin, propertyId)
  }

  @MessagePattern(MICROSERVICES.INDEXER.getFileContent)
  async getFileContent(@Payload() fileId: string) {
    return this.searchFilesService.getFileContent(fileId)
  }

  @MessagePattern(MICROSERVICES.INDEXER.getVehiclesMakers)
  async getVehiclesMakers(@Payload() model?: string) {
    return this.searchVehiclesService.getMakers(model)
  }

  @MessagePattern(MICROSERVICES.INDEXER.getVehiclesModels)
  async getVehiclesModels(@Payload() maker?: string) {
    return this.searchVehiclesService.getModels(maker)
  }
}
