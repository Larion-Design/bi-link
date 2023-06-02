import { BrowserModule } from '@app/browser-module'
import { LoaderModule } from '@app/loader-module'
import { ServiceCacheModule } from '@app/service-cache-module'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { RpcModule } from '@app/rpc'
import { ExtractorModule } from './modules/extractor'
import { TermeneRPCModule } from './modules/rpc'
import { SchedulerModule } from './modules/scheduler/schedulerModule'
import { TransformerModule } from './modules/transformer/transformerModule'

@Module({
  imports: [
    RpcModule,
    ServiceCacheModule,
    LoaderModule,
    SchedulerModule,
    ExtractorModule,
    TermeneRPCModule,
    TransformerModule,
    BrowserModule,
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
          dsn: configService.get<string>('SENTRY_DSN'),
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
