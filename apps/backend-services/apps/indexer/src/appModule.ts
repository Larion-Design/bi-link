import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConsumersModule } from './modules/consumers/consumersModule'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { EntitiesModule } from '@app/models/entitiesModule'
import { ServiceHealthModule } from '@app/service-health/serviceHealthModule'
import { IndexerModule } from './modules/indexer/indexerModule'
import { MappingModule } from './modules/mapping/mappingModule'
import { ProducersModule } from './modules/producers/producersModule'
import { PubModule } from '@app/rpc'
import { EntityEventsRPCController } from './modules/rpc/entityEventsRPCController'
import { MappingRPCController } from './modules/rpc/mappingRPCController'

@Module({
  imports: [
    EntitiesModule,
    MappingModule,
    IndexerModule,
    ProducersModule,
    ConsumersModule,
    ServiceHealthModule,
    PubModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          redis: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: +configService.getOrThrow<number>('REDIS_PORT'),
            password: configService.getOrThrow<string>('REDIS_PASSWORD'),
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          uri: configService.getOrThrow<string>('MONGODB_URI_READ'),
        }),
      inject: [ConfigService],
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
  controllers: [EntityEventsRPCController, MappingRPCController],
})
export class AppModule {}
