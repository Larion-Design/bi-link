import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MigrateDatabaseCommand } from './commands/migrateDatabaseCommand'
import { IndexEntityCommand } from './commands/indexEntityCommand'
import { MigrateIndex } from './commands/migrateIndex'
import { GraphUpdateCommand } from './commands/graphUpdateCommand'
import { RpcModule } from '@app/rpc'
import { EntitiesIndexerService } from './services/entitiesIndexerService'

@Module({
  imports: [
    RpcModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
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
