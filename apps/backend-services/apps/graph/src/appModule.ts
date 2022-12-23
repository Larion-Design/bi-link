import { EntitiesModule } from '@app/entities'
import { PubModule } from '@app/pub'
import { Module } from '@nestjs/common'
import { GraphModule } from '@app/graph-module'
import { EntityDocumentEventsController } from './controllers/entityDocumentEventsController'
import { PersonGraphService } from './services/personGraphService'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SentryModule } from '@ntegral/nestjs-sentry'
import { MongooseModule } from '@nestjs/mongoose'
import { Neo4jModule } from 'nest-neo4j/dist'
import { CompanyGraphService } from './services/companyGraphService'
import { IncidentGraphService } from './services/incidentGraphService'
import { PropertyGraphService } from './services/propertyGraphService'
import { ServiceHealthModule } from '@app/service-health'

@Module({
  imports: [
    EntitiesModule,
    PubModule,
    GraphModule,
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
          dsn: configService.get<string>('SENTRY_DSN'),
          debug: false,
          enabled: environment === 'production',
          environment: environment,
          release: configService.get<string>('APP_VERSION'),
          logLevel: 'debug',
        })
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          uri: configService.get<string>('MONGODB_URI'),
        }),
    }),
    Neo4jModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          scheme: 'neo4j',
          host: configService.get<string>('NEO4J_HOST'),
          port: +configService.get<number>('NEO4J_PORT'),
        }),
    }),
  ],
  providers: [PersonGraphService, CompanyGraphService, IncidentGraphService, PropertyGraphService],
  controllers: [EntityDocumentEventsController],
})
export class AppModule {}
