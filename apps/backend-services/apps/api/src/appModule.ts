import { CacheModule, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { GraphqlInterceptor, SentryModule } from '@ntegral/nestjs-sentry'
import { ApiModule } from './modules/api/apiModule'
import { UsersModule } from './modules/users/UsersModule'
import { RpcModule } from '@app/rpc'

@Module({
  imports: [
    RpcModule,
    ApiModule,
    UsersModule,
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      inject: [ConfigService],
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        const isProd = configService.getOrThrow<string>('NODE_ENV', 'development') === 'production'
        return Promise.resolve({
          debug: !isProd,
          cache: 'bounded',
          playground: !isProd,
          autoSchemaFile: true,
          sortSchema: true,
          cors: true,
          persistedQueries: {
            ttl: null,
          },
          introspection: !isProd,
          credentials: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          context: ({ req }) => ({ req }),
        })
      },
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
  ],
})
export class AppModule {}
