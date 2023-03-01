import { Module } from '@nestjs/common'
import { SearchToolsModule } from '@app/search-tools-module'
import { PersonIndexEventsConsumer } from './services/personIndexEventsConsumer'
import { CompanyIndexEventsConsumer } from './services/companyIndexEventsConsumer'
import { FileIndexEventsConsumer } from './services/fileIndexEventsConsumer'
import { EventIndexEventsConsumer } from './services/eventIndexEventsConsumer'
import { ProducersModule } from '../producers/producersModule'
import { PropertyIndexEventsConsumer } from './services/propertyIndexEventsConsumer'

@Module({
  imports: [SearchToolsModule, ProducersModule],
  providers: [
    PersonIndexEventsConsumer,
    CompanyIndexEventsConsumer,
    FileIndexEventsConsumer,
    EventIndexEventsConsumer,
    PropertyIndexEventsConsumer,
  ],
})
export class ConsumersModule {}
