import { EntitiesModule } from '@app/models'
import { PubModule } from '@app/pub'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { GraphModule } from '@app/graph-module'
import { Neo4jConfig } from 'nest-neo4j/src/interfaces/neo4j-config.interface'
import { ConsumersModule } from './consumers/consumersModule'
import { ProducersModule } from './producers/producersModule'
import { EntityEventsController } from './rpc/entityEventsController'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { MongooseModule } from '@nestjs/mongoose'
import { Neo4jModule, Neo4jScheme } from 'nest-neo4j/dist'
import { ServiceHealthModule } from '@app/service-health'

@Module({
  imports: [
    EntitiesModule,
    PubModule,
    GraphModule,
    ServiceHealthModule,
    ProducersModule,
    ConsumersModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          redis: {
            host: configService.getOrThrow<string>('REDIS_HOST'),
            port: +configService.getOrThrow<number>('REDIS_PORT'),
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
        const environment = configService.get<string>('NODE_ENV', 'development')
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          uri: configService.getOrThrow<string>('MONGODB_URI_READ'),
        }),
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve<Partial<Neo4jConfig>>({
          scheme: configService.getOrThrow<Neo4jScheme>('NEO4J_SCHEME'),
          host: configService.getOrThrow<string>('NEO4J_HOST'),
          port: +configService.getOrThrow<number>('NEO4J_PORT'),
          username: configService.getOrThrow<string>('NEO4J_USER'),
          password: configService.getOrThrow<string>('NEO4J_PASSWORD'),
        }),
    }),
  ],
  controllers: [EntityEventsController],
})
export class AppModule {}
