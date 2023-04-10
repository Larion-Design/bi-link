import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
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
} from './services'

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          node: configService.getOrThrow<string>('ELASTICSEARCH_URI'),
        }),
    }),
  ],
  providers: [
    SearchCompaniesService,
    SearchEventsService,
    SearchFilesService,
    SearchHelperService,
    SearchHistoryService,
    SearchPersonsService,
    SearchProceedingsService,
    SearchPropertiesService,
    SearchVehiclesService,
  ],
  exports: [
    SearchCompaniesService,
    SearchEventsService,
    SearchFilesService,
    SearchHistoryService,
    SearchPersonsService,
    SearchProceedingsService,
    SearchPropertiesService,
    SearchVehiclesService,
  ],
})
export class SearchModule {}
