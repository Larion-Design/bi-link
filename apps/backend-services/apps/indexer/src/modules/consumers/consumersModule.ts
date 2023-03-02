import { Module } from '@nestjs/common'
import { IndexerModule } from '../indexer/indexerModule'
import { PersonIndexEventsConsumer } from './services/personIndexEventsConsumer'
import { CompanyIndexEventsConsumer } from './services/companyIndexEventsConsumer'
import { FileIndexEventsConsumer } from './services/fileIndexEventsConsumer'
import { EventIndexEventsConsumer } from './services/eventIndexEventsConsumer'
import { ProducersModule } from '../producers/producersModule'
import { PropertyIndexEventsConsumer } from './services/propertyIndexEventsConsumer'

@Module({
  imports: [ProducersModule, IndexerModule],
  providers: [
    PersonIndexEventsConsumer,
    CompanyIndexEventsConsumer,
    FileIndexEventsConsumer,
    EventIndexEventsConsumer,
    PropertyIndexEventsConsumer,
  ],
})
export class ConsumersModule {}
