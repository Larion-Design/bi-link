import { EntitiesModule } from '@app/entities'
import { PubModule } from '@app/pub'
import { HistoryIndexerService } from '@app/search-tools-module/indexer'
import { Module } from '@nestjs/common'
import { CompaniesIndexerService } from '@app/search-tools-module/indexer/companiesIndexerService'
import { ConnectedEntityIndexerService } from '@app/search-tools-module/indexer/connectedEntityIndexerService'
import { EventsIndexerService } from '@app/search-tools-module/indexer/eventsIndexerService'
import { FilesIndexerService } from '@app/search-tools-module/indexer/filesIndexerService'
import { LocationIndexerService } from '@app/search-tools-module/indexer/locationIndexerService'
import { PersonsIndexerService } from '@app/search-tools-module/indexer/personsIndexerService'
import { PropertiesIndexerService } from '@app/search-tools-module/indexer/propertiesIndexerService'
import { CompaniesMappingService } from '@app/search-tools-module/mapping/companiesMappingService'
import { FilesMappingService } from '@app/search-tools-module/mapping/filesMappingService'
import { EventsMappingService } from '@app/search-tools-module/mapping/eventsMappingService'
import { PersonsMappingService } from '@app/search-tools-module/mapping/personsMappingService'
import { PropertiesMappingService } from '@app/search-tools-module/mapping/propertiesMappingService'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MappingHelperService } from './mapping/mappingHelperService'
import { HistoryMappingService, MappingValidatorService } from '@app/search-tools-module/mapping'

@Module({
  imports: [
    PubModule,
    EntitiesModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          node: configService.get<string>('ELASTICSEARCH_URI'),
        }),
    }),
  ],
  providers: [
    ConnectedEntityIndexerService,
    LocationIndexerService,
    MappingHelperService,
    MappingValidatorService,
    PersonsMappingService,
    PersonsIndexerService,
    CompaniesIndexerService,
    CompaniesMappingService,
    FilesMappingService,
    FilesIndexerService,
    EventsMappingService,
    EventsIndexerService,
    PropertiesMappingService,
    PropertiesIndexerService,
    HistoryMappingService,
    HistoryIndexerService,
  ],
  exports: [
    ConnectedEntityIndexerService,
    LocationIndexerService,
    MappingHelperService,
    MappingValidatorService,
    PersonsMappingService,
    PersonsIndexerService,
    CompaniesIndexerService,
    CompaniesMappingService,
    FilesMappingService,
    FilesIndexerService,
    EventsMappingService,
    EventsIndexerService,
    PropertiesMappingService,
    PropertiesIndexerService,
    HistoryMappingService,
    HistoryIndexerService,
  ],
})
export class SearchToolsModule {}
