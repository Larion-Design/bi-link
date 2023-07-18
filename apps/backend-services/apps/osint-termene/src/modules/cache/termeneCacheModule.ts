import { CacheModule } from '@app/cache'
import { Module } from '@nestjs/common'
import { ImportedCompaniesCacheService, SearchResultsCacheService } from './services'

@Module({
  imports: [CacheModule],
  providers: [ImportedCompaniesCacheService, SearchResultsCacheService],
  exports: [ImportedCompaniesCacheService, SearchResultsCacheService],
})
export class TermeneCacheModule {}
