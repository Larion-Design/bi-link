import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CacheService } from './cacheService'

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> =>
        Promise.resolve({
          config: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: +configService.getOrThrow<number>('REDIS_PORT'),
          },
        }),
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
