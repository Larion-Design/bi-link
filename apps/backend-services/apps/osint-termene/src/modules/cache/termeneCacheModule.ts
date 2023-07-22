import { CacheModule } from '@app/cache'
import { Module } from '@nestjs/common'
import { ImportedEntitiesCacheService, SearchResultsCacheService } from './services'

@Module({
  imports: [CacheModule],
  providers: [ImportedEntitiesCacheService, SearchResultsCacheService],
  exports: [ImportedEntitiesCacheService, SearchResultsCacheService],
})
export class TermeneCacheModule {}
