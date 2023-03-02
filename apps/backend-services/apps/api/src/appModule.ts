import { CacheModule, Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { Neo4jModule, Neo4jScheme } from 'nest-neo4j/dist'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { Neo4jConfig } from 'nest-neo4j/src/interfaces/neo4j-config.interface'
import { SearchModule } from './modules/search/searchModule'
import { GraphqlInterceptor, SentryModule } from '@ntegral/nestjs-sentry'
import { ApiModule } from './modules/api/apiModule'
import { UsersModule } from './modules/users/UsersModule'
import { EntitiesModule } from '@app/models/entitiesModule'
import { PubModule } from '@app/pub'
import { GraphModule } from '@app/graph-module'

@Module({
  imports: [
    EntitiesModule,
    PubModule,
    ApiModule,
    SearchModule,
    UsersModule,
    GraphModule,
    CacheModule.register({
      isGlobal: true,
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          uri: configService.getOrThrow<string>('MONGODB_URI'),
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new GraphqlInterceptor(),
    },
  ],
})
export class AppModule {}
