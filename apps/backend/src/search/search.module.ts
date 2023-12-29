import { SearchEventsHandlerService } from '@modules/search/services/search-events-handler.service'
import { Global, Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import {
  CompaniesIndexerService,
  ConnectedEntityIndexerService,
  CustomFieldsIndexerService,
  EventsIndexerService,
  FilesIndexerService,
  HistoryIndexerService,
  LocationIndexerService,
  PersonsIndexerService,
  PropertiesIndexerService,
  ProceedingsIndexerService,
} from './services/index'

import {
  CompaniesMappingService,
  EventsMappingService,
  FilesMappingService,
  HistoryMappingService,
  MappingHelperService,
  MappingValidatorService,
  PersonsMappingService,
  ProceedingsMappingService,
  PropertiesMappingService,
} from './services/mapping'
import {
  SearchCompaniesService,
  SearchEventsService,
  SearchFilesService,
  SearchHelperService,
  SearchHistoryService,
  SearchPersonsService,
  SearchProceedingsService,
  SearchPropertiesService,
  SearchVehiclesService,
} from './services/search'

const providers: Provider[] = [
  SearchCompaniesService,
  SearchEventsService,
  SearchFilesService,
  SearchHistoryService,
  SearchPersonsService,
  SearchProceedingsService,
  SearchPropertiesService,
  SearchVehiclesService,
  SearchHelperService,

  CompaniesMappingService,
  EventsMappingService,
  FilesMappingService,
  HistoryMappingService,
  MappingHelperService,
  MappingValidatorService,
  PersonsMappingService,
  PropertiesMappingService,
  ProceedingsMappingService,

  CustomFieldsIndexerService,
  ConnectedEntityIndexerService,
  LocationIndexerService,
  PersonsIndexerService,
  CompaniesIndexerService,
  FilesIndexerService,
  EventsIndexerService,
  PropertiesIndexerService,
  HistoryIndexerService,
  ProceedingsIndexerService,

  SearchEventsHandlerService,
]

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        node: configService.getOrThrow<string>('ELASTICSEARCH_URI'),
      }),
    }),
  ],
  providers,
  exports: providers,
})
export class SearchModule {}
