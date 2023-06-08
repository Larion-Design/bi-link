import {
  CacheService,
  CompanyCacheService,
  PersonCacheService,
  ProceedingCacheService,
} from './services'
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PropertyCacheService } from './services/propertyCacheService'

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> =>
        Promise.resolve({
          config: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: configService.getOrThrow<number>('REDIS_PORT'),
          },
        }),
    }),
  ],
  providers: [
    CacheService,
    PersonCacheService,
    ProceedingCacheService,
    CompanyCacheService,
    PropertyCacheService,
  ],
  exports: [PersonCacheService, ProceedingCacheService, CompanyCacheService, PropertyCacheService],
})
export class CacheModule {}
