import { ConfigModule, ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConsumersModule } from './modules/consumers/consumersModule'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { ServiceHealthModule } from '@app/service-health/serviceHealthModule'
import { IndexerModule } from './modules/indexer/indexerModule'
import { MappingModule } from './modules/mapping/mappingModule'
import { ProducersModule } from './modules/producers/producersModule'
import { RpcModule } from '@app/rpc'
import { IndexerController } from './modules/rpc/indexerController'
import { MappingController } from './modules/rpc/mappingController'
import { SearchModule } from './modules/search/searchModule'

@Module({
  imports: [
    MappingModule,
    IndexerModule,
    SearchModule,
    ProducersModule,
    ConsumersModule,
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
  controllers: [IndexerController, MappingController],
})
export class AppModule {}
