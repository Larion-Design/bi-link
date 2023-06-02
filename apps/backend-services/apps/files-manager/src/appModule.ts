import { RpcModule } from '@app/rpc'
import { ServiceHealthModule } from '@app/service-health'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { FilesModule } from './files/filesModule'
import { FilesManagerRPCModule } from './rpc/filesManagerRPCModule'

@Module({
  imports: [
    RpcModule,
    FilesModule,
    FilesManagerRPCModule,
    ServiceHealthModule,
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
