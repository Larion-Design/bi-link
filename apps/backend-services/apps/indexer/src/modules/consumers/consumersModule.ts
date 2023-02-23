import { Module } from '@nestjs/common'
import { SearchToolsModule } from '@app/search-tools-module'
import { PersonIndexEventsConsumer } from './services/personIndexEventsConsumer'
import { CompanyIndexEventsConsumer } from './services/companyIndexEventsConsumer'
import { FileIndexEventsConsumer } from './services/fileIndexEventsConsumer'
import { PersonsQueueWatcherService } from './services/personsQueueWatcherService'
import { FilesQueueWatcherService } from './services/filesQueueWatcherService'
import { CompaniesQueueWatcherService } from './services/companiesQueueWatcherService'
import { EventIndexEventsConsumer } from './services/eventIndexEventsConsumer'
import { EventsQueueWatcherService } from './services/incidentsQueueWatcherService'
import { ProducersModule } from '../producers/producersModule'
import { PropertiesQueueWatcherService } from './services/propertiesQueueWatcherService'
import { PropertyIndexEventsConsumer } from './services/propertyIndexEventsConsumer'

@Module({
  imports: [SearchToolsModule, ProducersModule],
  providers: [
    PersonIndexEventsConsumer,
    PersonsQueueWatcherService,
    CompanyIndexEventsConsumer,
    CompaniesQueueWatcherService,
    FileIndexEventsConsumer,
    FilesQueueWatcherService,
    EventIndexEventsConsumer,
    EventsQueueWatcherService,
    PropertiesQueueWatcherService,
    PropertyIndexEventsConsumer,
  ],
})
export class ConsumersModule {}
