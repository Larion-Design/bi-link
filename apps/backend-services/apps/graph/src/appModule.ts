import { RpcModule } from '@app/rpc'
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ConsumersModule } from './consumers/consumersModule'
import { ProducersModule } from './producers/producersModule'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { ServiceHealthModule } from '@app/service-health'
import { GraphRPCModule } from './rpc/graphRPCModule'

@Module({
  imports: [
    RpcModule,
    ServiceHealthModule,
    ProducersModule,
    ConsumersModule,
    GraphRPCModule,
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
  ],
})
export class AppModule {}
