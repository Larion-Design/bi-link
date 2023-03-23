import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SearchEventsService } from './services/searchEventsService'
import { SearchFilesService } from './services/searchFilesService'
import { SearchPersonsService } from './services/searchPersonsService'
import { SearchHistoryService } from './services/searchHistoryService'
import { SearchCompaniesService } from './services/searchCompaniesService'
import { FrequentCustomFieldsService } from './services/frequentCustomFieldsService'
import { SearchHelperService } from './services/searchHelperService'
import { SearchProceedingsService } from './services/searchProceedingsService'
import { SearchVehiclesService } from './services/searchVehiclesService'
import { SimilarEntitiesService } from './services/similarEntitiesService'
import { SearchPropertiesService } from './services/searchPropertiesService'

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          node: configService.get<string>('ELASTICSEARCH_URI'),
        }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    SearchHelperService,
    SearchPersonsService,
    SearchCompaniesService,
    SearchHistoryService,
    SearchVehiclesService,
    SearchEventsService,
    SearchPropertiesService,
    FrequentCustomFieldsService,
    SimilarEntitiesService,
    SearchFilesService,
    SearchProceedingsService,
  ],
  exports: [
    SearchPersonsService,
    SearchCompaniesService,
    SearchHistoryService,
    SearchVehiclesService,
    SearchEventsService,
    SearchPropertiesService,
    FrequentCustomFieldsService,
    SimilarEntitiesService,
    SearchFilesService,
    SearchProceedingsService,
  ],
})
export class SearchModule {}
