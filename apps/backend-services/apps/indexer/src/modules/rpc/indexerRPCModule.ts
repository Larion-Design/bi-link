import { Module } from '@nestjs/common'
import { IndexerModule } from '../indexer/indexerModule'
import { MappingModule } from '../mapping/mappingModule'
import { IndexerSchedulerModule } from '../scheduler/indexerSchedulerModule'
import { SearchModule } from '../search/searchModule'
import { IndexerController } from './controllers/indexerController'
import { MappingController } from './controllers/mappingController'
import { SearchController } from './controllers/searchController'

@Module({
  imports: [IndexerSchedulerModule, MappingModule, IndexerModule, SearchModule],
  controllers: [IndexerController, MappingController, SearchController],
})
export class IndexerRPCModule {}
