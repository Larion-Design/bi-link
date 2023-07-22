import { Module } from '@nestjs/common'
import { IndexerModule } from '../indexer/indexerModule'
import { MappingModule } from '../mapping/mappingModule'
import { SearchModule } from '../search/searchModule'
import { IndexerController } from './controllers/indexerController'
import { MappingController } from './controllers/mappingController'
import { SearchController } from './controllers/searchController'

@Module({
  imports: [MappingModule, IndexerModule, SearchModule],
  controllers: [IndexerController, MappingController, SearchController],
})
export class IndexerRPCModule {}
