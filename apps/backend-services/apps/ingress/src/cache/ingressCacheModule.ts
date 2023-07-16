import { CacheModule } from '@app/cache'
import { CompanyCacheService, PersonCacheService, ProceedingCacheService } from './services'
import { Module } from '@nestjs/common'
import { PropertyCacheService } from './services/propertyCacheService'

@Module({
  imports: [CacheModule],
  providers: [
    PersonCacheService,
    ProceedingCacheService,
    CompanyCacheService,
    PropertyCacheService,
  ],
  exports: [PersonCacheService, ProceedingCacheService, CompanyCacheService, PropertyCacheService],
})
export class IngressCacheModule {}
