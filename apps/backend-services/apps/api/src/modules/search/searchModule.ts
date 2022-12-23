import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SearchPersonsService } from './services/searchPersonsService'
import { SearchHistoryService } from './services/searchHistoryService'
import { SearchCompaniesService } from './services/searchCompaniesService'
import { FrequentCustomFieldsService } from './services/frequentCustomFieldsService'
import { SearchHelperService } from './services/searchHelperService'
import { SearchVehiclesService } from './services/searchVehiclesService'
import { SearchIncidentsService } from './services/searchIncidentsService'
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
    SearchIncidentsService,
    SearchPropertiesService,
    FrequentCustomFieldsService,
    SimilarEntitiesService,
  ],
  exports: [
    SearchPersonsService,
    SearchCompaniesService,
    SearchHistoryService,
    SearchVehiclesService,
    SearchIncidentsService,
    SearchPropertiesService,
    FrequentCustomFieldsService,
    SimilarEntitiesService,
  ],
})
export class SearchModule {}
