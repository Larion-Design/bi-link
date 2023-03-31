import { Module } from '@nestjs/common'
import { IndexerModule } from '../indexer/indexerModule'
import { SearchModule } from '../search/searchModule'
import { PersonIndexEventsConsumer } from './services/personIndexEventsConsumer'
import { CompanyIndexEventsConsumer } from './services/companyIndexEventsConsumer'
import { FileIndexEventsConsumer } from './services/fileIndexEventsConsumer'
import { EventIndexEventsConsumer } from './services/eventIndexEventsConsumer'
import { ProducersModule } from '../producers/producersModule'
import { ProceedingIndexEventsConsumer } from './services/proceedingIndexEventsConsumer'
import { PropertyIndexEventsConsumer } from './services/propertyIndexEventsConsumer'

@Module({
  imports: [ProducersModule, IndexerModule, SearchModule],
  providers: [
    PersonIndexEventsConsumer,
    CompanyIndexEventsConsumer,
    FileIndexEventsConsumer,
    EventIndexEventsConsumer,
    PropertyIndexEventsConsumer,
    ProceedingIndexEventsConsumer,
  ],
})
export class ConsumersModule {}
