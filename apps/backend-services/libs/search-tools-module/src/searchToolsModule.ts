import { PubModule } from '@app/pub'
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
import { EventMappingService } from '@app/search-tools-module/mapping/eventMappingService'
import { PersonsMappingService } from '@app/search-tools-module/mapping/personsMappingService'
import { PropertiesMappingService } from '@app/search-tools-module/mapping/propertiesMappingService'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MappingHelperService } from './mapping/mappingHelperService'
import { MappingValidatorService } from '@app/search-tools-module/mapping'

@Module({
  imports: [
    PubModule,
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
    EventMappingService,
    EventsIndexerService,
    PropertiesMappingService,
    PropertiesIndexerService,
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
    EventMappingService,
    EventsIndexerService,
    PropertiesMappingService,
    PropertiesIndexerService,
  ],
})
export class SearchToolsModule {}
