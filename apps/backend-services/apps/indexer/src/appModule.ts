import { ConfigModule, ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { ServiceHealthModule } from '@app/service-health/serviceHealthModule'
import { IndexerModule } from './modules/indexer/indexerModule'
import { MappingModule } from './modules/mapping/mappingModule'
import { RpcModule } from '@app/rpc'
import { IndexerRPCModule } from './modules/rpc/indexerRPCModule'
import { IndexerSchedulerModule } from './modules/scheduler/indexerSchedulerModule'
import { SearchModule } from './modules/search/searchModule'

@Module({
  imports: [
    IndexerRPCModule,
    MappingModule,
    IndexerModule,
    SearchModule,
    IndexerSchedulerModule,
    ServiceHealthModule,
    RpcModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          redis: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: +configService.getOrThrow<number>('REDIS_PORT'),
            // password: configService.get<string>('REDIS_PASSWORD', undefined),
            // tls: {},
          },
          defaultJobOptions: {
            removeOnFail: false,
            removeOnComplete: true,
            timeout: 60000,
          },
        }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.getOrThrow<string>('NODE_ENV', 'development')
        return Promise.resolve({
          dsn: configService.getOrThrow<string>('SENTRY_DSN'),
          debug: false,
          enabled: environment === 'production',
          environment: environment,
          release: configService.getOrThrow<string>('APP_VERSION'),
          logLevel: 'debug',
        })
      },
    }),
  ],
})
export class AppModule {}
