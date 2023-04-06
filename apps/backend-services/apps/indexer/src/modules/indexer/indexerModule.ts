import { Module } from '@nestjs/common'
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
} from './services'
import { ProceedingsIndexerService } from './services/proceedingsIndexerService'

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
  ],
  exports: [
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
  ],
})
export class IndexerModule {}
