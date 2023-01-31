import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PersonEventDispatcherService } from './services/personEventDispatcherService'
import { CompanyEventDispatcherService } from './services/companyEventDispatcherService'
import { FileEventDispatcherService } from './services/fileEventDispatcherService'
import { IncidentEventDispatcherService } from './services/incidentEventDispatcherService'
import { RelatedEntitiesSearchService } from './services/relatedEntitiesSearchService'
import {
  QUEUE_COMPANIES,
  QUEUE_FILES,
  QUEUE_INCIDENTS,
  QUEUE_PERSONS,
  QUEUE_PROPERTIES,
  QUEUE_REPORTS,
} from './constants'
import { PropertyEventDispatcherService } from './services/propertyEventDispatcherService'
import { ReportEventDispatcherService } from './services/reportEventDispatcherService'

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_PERSONS },
      { name: QUEUE_COMPANIES },
      { name: QUEUE_FILES },
      { name: QUEUE_INCIDENTS },
      { name: QUEUE_PROPERTIES },
      { name: QUEUE_REPORTS },
    ),
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
    PropertyEventDispatcherService,
    PersonEventDispatcherService,
    CompanyEventDispatcherService,
    FileEventDispatcherService,
    IncidentEventDispatcherService,
    RelatedEntitiesSearchService,
    ReportEventDispatcherService,
  ],
  exports: [
    PropertyEventDispatcherService,
    PersonEventDispatcherService,
    CompanyEventDispatcherService,
    FileEventDispatcherService,
    IncidentEventDispatcherService,
    ReportEventDispatcherService,
    RelatedEntitiesSearchService,
  ],
})
export class ProducersModule {}
