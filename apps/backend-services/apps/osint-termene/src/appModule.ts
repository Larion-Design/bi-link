import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { RpcModule } from '@app/rpc'
import { TermeneRPCModule } from './modules/rpc/termeneRPCModule'
import { ExtractorModule } from './modules/extractor/extractorModule'
import { TransformerModule } from './modules/transformer/transformerModule'

@Module({
  imports: [
    RpcModule,
    ExtractorModule,
    TermeneRPCModule,
    TransformerModule,
    CacheModule.register({
      isGlobal: true,
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
  providers: [],
})
export class AppModule {}
