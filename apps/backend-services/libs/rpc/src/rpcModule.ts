import { Global, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MICROSERVICES } from '@app/rpc/constants'
import { ActivityHistoryService } from '@app/rpc/microservices/activityHistory/activityHistoryService'
import { GlobalEventsService } from '@app/rpc/microservices/globalEvents/globalEventsService'
import { GraphService } from '@app/rpc/microservices/graph/graphService'
import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'
import { IngressService } from '@app/rpc/microservices/ingress'
import { FileParserService } from '@app/rpc/microservices/filesParser/fileParserService'
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
        MICROSERVICES.FILES_PARSER.id,
        MICROSERVICES.INDEXER.id,
      ].map((name) => ({
        name,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          Promise.resolve({
            transport: Transport.REDIS,
            options: {
              host: configService.getOrThrow('REDIS_HOST'),
              port: configService.getOrThrow('REDIS_PORT'),
              // password: configService.getOrThrow('REDIS_PASSWORD'),
              // tls: {},
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
    FileParserService,
    GraphService,
    FilesManagerService,
  ],
  exports: [
    GlobalEventsService,
    IngressService,
    IndexerService,
    ActivityHistoryService,
    FileParserService,
    GraphService,
    FilesManagerService,
  ],
})
export class RpcModule {}
