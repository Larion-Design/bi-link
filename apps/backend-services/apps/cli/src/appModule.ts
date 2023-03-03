import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { CacheModule, Module } from '@nestjs/common'
import { EntitiesModule } from '@app/models'
import { MigrateDatabaseCommand } from './commands/migrateDatabaseCommand'
import { IndexEntityCommand } from './commands/indexEntityCommand'
import { MigrateIndex } from './commands/migrateIndex'
import { GraphUpdateCommand } from './commands/graphUpdateCommand'
import { PubModule } from '@app/pub'
import { EntitiesIndexerService } from './services/entitiesIndexerService'

@Module({
  imports: [
    PubModule,
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
          uri: configService.getOrThrow<string>('MONGODB_URI'),
        }),
    }),
  ],
  providers: [
    MigrateDatabaseCommand,
    MigrateIndex,
    IndexEntityCommand,
    GraphUpdateCommand,
    EntitiesIndexerService,
  ],
})
export class AppModule {}
