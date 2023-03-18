import { SchedulerModule } from '@app/scheduler-module'
import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PersonEventDispatcherService } from './services/personEventDispatcherService'
import { CompanyEventDispatcherService } from './services/companyEventDispatcherService'
import { FileEventDispatcherService } from './services/fileEventDispatcherService'
import { EventDispatcherService } from './services/eventDispatcherService'
import { ProceedingEventDispatcherService } from './services/proceedingEventDispatcherService'
import { RelatedEntitiesSearchService } from './services/relatedEntitiesSearchService'
import {
  QUEUE_COMPANIES,
  QUEUE_FILES,
  QUEUE_EVENTS,
  QUEUE_PERSONS,
  QUEUE_PROPERTIES,
  QUEUE_REPORTS,
  QUEUE_PROCEEDINGS,
} from './constants'
import { PropertyEventDispatcherService } from './services/propertyEventDispatcherService'
import { ReportEventDispatcherService } from './services/reportEventDispatcherService'

@Module({
  imports: [
    SchedulerModule,
    BullModule.registerQueue(
      { name: QUEUE_PERSONS },
      { name: QUEUE_COMPANIES },
      { name: QUEUE_FILES },
      { name: QUEUE_EVENTS },
      { name: QUEUE_PROPERTIES },
      { name: QUEUE_REPORTS },
      { name: QUEUE_PROCEEDINGS },
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
    EventDispatcherService,
    RelatedEntitiesSearchService,
    ReportEventDispatcherService,
    ProceedingEventDispatcherService,
  ],
  exports: [
    PropertyEventDispatcherService,
    PersonEventDispatcherService,
    CompanyEventDispatcherService,
    FileEventDispatcherService,
    EventDispatcherService,
    ReportEventDispatcherService,
    RelatedEntitiesSearchService,
    ProceedingEventDispatcherService,
  ],
})
export class ProducersModule {}
