import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import {
  CompaniesMappingService,
  EventsMappingService,
  FilesMappingService,
  HistoryMappingService,
  MappingHelperService,
  MappingValidatorService,
  PersonsMappingService,
  PropertiesMappingService,
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
    CompaniesMappingService,
    EventsMappingService,
    FilesMappingService,
    HistoryMappingService,
    MappingHelperService,
    MappingValidatorService,
    PersonsMappingService,
    PropertiesMappingService,
  ],
  exports: [
    CompaniesMappingService,
    EventsMappingService,
    FilesMappingService,
    HistoryMappingService,
    MappingValidatorService,
    PersonsMappingService,
    PropertiesMappingService,
  ],
})
export class MappingModule {}
