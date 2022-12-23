import { Module } from '@nestjs/common'
import { IndexerModule } from '../indexer/indexerModule'
import { PersonIndexEventsConsumer } from './services/personIndexEventsConsumer'
import { CompanyIndexEventsConsumer } from './services/companyIndexEventsConsumer'
import { FileIndexEventsConsumer } from './services/fileIndexEventsConsumer'
import { PersonsQueueWatcherService } from './services/personsQueueWatcherService'
import { FilesQueueWatcherService } from './services/filesQueueWatcherService'
import { CompaniesQueueWatcherService } from './services/companiesQueueWatcherService'
import { IncidentIndexEventsConsumer } from './services/incidentIndexEventsConsumer'
import { IncidentsQueueWatcherService } from './services/incidentsQueueWatcherService'
import { ProducersModule } from '../producers/producersModule'
import { PropertiesQueueWatcherService } from './services/propertiesQueueWatcherService'
import { PropertyIndexEventsConsumer } from './services/propertyIndexEventsConsumer'

@Module({
  imports: [IndexerModule, ProducersModule],
  providers: [
    PersonIndexEventsConsumer,
    PersonsQueueWatcherService,
    CompanyIndexEventsConsumer,
    CompaniesQueueWatcherService,
    FileIndexEventsConsumer,
    FilesQueueWatcherService,
    IncidentIndexEventsConsumer,
    IncidentsQueueWatcherService,
    PropertiesQueueWatcherService,
    PropertyIndexEventsConsumer,
  ],
})
export class ConsumersModule {}
