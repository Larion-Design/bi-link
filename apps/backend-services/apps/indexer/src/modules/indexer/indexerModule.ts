import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { PubModule } from '@app/pub/pubModule'
import { SearchToolsModule } from '@app/search-mapping-tools/searchToolsModule'
import { ProducersModule } from '../producers/producersModule'
import { FilesIndexerService } from './file/services/filesIndexerService'
import { MappingValidatorService } from '@app/search-mapping-tools/services/mapping/mappingValidatorService'
import { FilesMappingService } from './file/services/filesMappingService'
import { CompaniesIndexerService } from './company/services/companiesIndexerService'
import { CompaniesMappingService } from './company/services/companiesMappingService'
import { PersonsIndexerService } from './person/services/personsIndexerService'
import { PersonsMappingService } from './person/services/personsMappingService'
import { MappingHelperService } from '@app/search-mapping-tools/services/mapping/mappingHelperService'
import { IncidentsIndexerService } from './incident/services/incidentsIndexerService'
import { IncidentMappingService } from './incident/services/incidentMappingService'
import { ConnectedEntityIndexerService } from './shared/services/connectedEntityIndexerService'
import { PropertiesIndexerService } from './property/services/propertiesIndexerService'
import { PropertiesMappingService } from './property/services/propertiesMappingService'

@Module({
  imports: [
    PubModule,
    ProducersModule,
    SearchToolsModule,
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
    MappingHelperService,
    MappingValidatorService,
    PersonsMappingService,
    PersonsIndexerService,
    CompaniesIndexerService,
    CompaniesMappingService,
    FilesMappingService,
    FilesIndexerService,
    IncidentMappingService,
    IncidentsIndexerService,
    PropertiesMappingService,
    PropertiesIndexerService,
  ],
  exports: [
    PersonsIndexerService,
    CompaniesIndexerService,
    FilesIndexerService,
    IncidentsIndexerService,
    PropertiesIndexerService,
  ],
})
export class IndexerModule {}
