import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Neo4jModule, Neo4jScheme } from 'nest-neo4j/dist'
import { Neo4jConfig } from 'nest-neo4j/src/interfaces/neo4j-config.interface'
import { CompanyGraphService } from './services/companyGraphService'
import { EventGraphService } from './services/eventGraphService'
import { GraphService } from './services/graphService'
import { LocationGraphService } from './services/locationGraphService'
import { PersonGraphService } from './services/personGraphService'
import { ProceedingGraphService } from './services/proceedingGraphService'
import { PropertyGraphService } from './services/propertyGraphService'
import { ReportGraphService } from './services/reportGraphService'

@Global()
@Module({
  imports: [
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
    GraphService,
    CompanyGraphService,
    EventGraphService,
    LocationGraphService,
    PersonGraphService,
    ProceedingGraphService,
    PropertyGraphService,
    ReportGraphService,
  ],
  exports: [
    GraphService,
    CompanyGraphService,
    EventGraphService,
    LocationGraphService,
    PersonGraphService,
    ProceedingGraphService,
    PropertyGraphService,
    ReportGraphService,
  ],
})
export class GraphModule {}
