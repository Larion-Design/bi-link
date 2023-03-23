import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import {
  CompaniesIndexerService,
  ConnectedEntityIndexerService,
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
