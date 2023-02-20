import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConsumersModule } from './modules/consumers/consumersModule'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { EntitiesModule } from '@app/entities/entitiesModule'
import { ServiceHealthModule } from '@app/service-health/serviceHealthModule'
import { ProducersModule } from './modules/producers/producersModule'
import { PubModule } from '@app/pub'
import { EntityEventsController } from './modules/controllers/entityEventsController'

@Module({
  imports: [
    EntitiesModule,
    ConsumersModule,
    ProducersModule,
    ServiceHealthModule,
    PubModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          redis: {
            host: configService.get<string>('REDIS_HOST'),
            port: +configService.get<number>('REDIS_PORT'),
          },
          defaultJobOptions: {
            removeOnFail: true,
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
          uri: configService.get<string>('MONGODB_URI'),
        }),
      inject: [ConfigService],
    }),
    SentryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const environment = configService.get<string>('NODE_ENV', 'development')
        return Promise.resolve({
          dsn: configService.get<string>('SENTRY_DSN'),
          debug: false,
          enabled: environment === 'production',
          environment: environment,
          release: configService.get<string>('APP_VERSION'),
          logLevel: 'debug',
        })
      },
    }),
  ],
  controllers: [EntityEventsController],
})
export class AppModule {}
