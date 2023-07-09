import { RPCValidator } from '@app/rpc/interceptors/RPCValidator'
import { OsintTermeneService } from '@app/rpc/microservices/osint/termene'
import { Global, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MICROSERVICES } from '@app/rpc/constants'
import { ActivityHistoryService } from '@app/rpc/microservices/activityHistory/activityHistoryService'
import { GlobalEventsService } from '@app/rpc/microservices/globalEvents/globalEventsService'
import { GraphService } from '@app/rpc/microservices/graph/graphService'
import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { IngressService } from '@app/rpc/microservices/ingress'
import { FilesManagerService } from '@app/rpc/microservices/filesManager/filesManagerService'

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync(
      [
        MICROSERVICES.GLOBAL.id,
        MICROSERVICES.INGRESS.id,
        MICROSERVICES.GRAPH.id,
        MICROSERVICES.ACTIVITY_HISTORY.id,
        MICROSERVICES.FILES_MANAGER.id,
        MICROSERVICES.INDEXER.id,
        MICROSERVICES.OSINT.TERMENE.id,
      ].map((name) => ({
        name,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          Promise.resolve({
            transport: Transport.NATS,
            options: {
              servers: [configService.getOrThrow<string>('NATS_URI')],
            },
          }),
      })),
    ),
  ],
  providers: [
    RPCValidator,
    GlobalEventsService,
    IngressService,
    IndexerService,
    ActivityHistoryService,
    GraphService,
    FilesManagerService,
    OsintTermeneService,
  ],
  exports: [
    RPCValidator,
    GlobalEventsService,
    IngressService,
    IndexerService,
    ActivityHistoryService,
    GraphService,
    FilesManagerService,
    OsintTermeneService,
  ],
})
export class RpcModule {}
