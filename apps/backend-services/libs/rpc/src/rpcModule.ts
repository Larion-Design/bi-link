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
    GlobalEventsService,
    IngressService,
    IndexerService,
    ActivityHistoryService,
    GraphService,
    FilesManagerService,
  ],
  exports: [
    GlobalEventsService,
    IngressService,
    IndexerService,
    ActivityHistoryService,
    GraphService,
    FilesManagerService,
  ],
})
export class RpcModule {}
