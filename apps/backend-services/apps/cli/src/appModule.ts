import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { Neo4jModule } from 'nest-neo4j/dist'
import { CacheModule, Module } from '@nestjs/common'
import { EntitiesModule } from '@app/entities'
import { SearchToolsModule } from '@app/search-tools-module'
import { DatabaseMigrationCommand } from './commands/databaseMigrationCommand'
import { ElasticsearchIndexEntityCommand } from './commands/elasticsearchIndexEntityCommand'
import { ElasticsearchMigrationCommand } from './commands/elasticsearchMigrationCommand'
import { GraphMigrationCommand } from './commands/graphMigrationCommand'
import { PubModule } from '@app/pub'

@Module({
  imports: [
    EntitiesModule,
    PubModule,
    SearchToolsModule,
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
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
  providers: [
    DatabaseMigrationCommand,
    ElasticsearchMigrationCommand,
    ElasticsearchIndexEntityCommand,
    GraphMigrationCommand,
  ],
})
export class AppModule {}
