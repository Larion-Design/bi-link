import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { Neo4jModule } from 'nest-neo4j/dist'
import { CacheModule, Module } from '@nestjs/common'
import { EntitiesModule } from '@app/entities'
import { SearchToolsModule } from '@app/search-tools-module'
import { MigrateDatabaseCommand } from './commands/migrateDatabaseCommand'
import { IndexEntityCommand } from './commands/indexEntityCommand'
import { MigrateIndex } from './commands/migrateIndex'
import { GraphUpdateCommand } from './commands/graphUpdateCommand'
import { PubModule } from '@app/pub'
import { EntitiesIndexerService } from './search/entitiesIndexerService'
import { EntitiesMappingService } from './search/entitiesMappingService'

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
    MigrateDatabaseCommand,
    MigrateIndex,
    IndexEntityCommand,
    GraphUpdateCommand,
    EntitiesIndexerService,
    EntitiesMappingService,
  ],
})
export class AppModule {}
