import { GraphService } from '@app/rpc/services/graphService'
import { IndexerService } from '@app/rpc/services/indexerService'
import { Global, Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MICROSERVICES } from '@app/rpc/constants'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EntityEventsService } from '@app/rpc/services/entityEventsService'
import { UserActionsService } from '@app/rpc/services/userActionsService'
import { FileParserService } from '@app/rpc/services/fileParserService'

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync(
      [
        MICROSERVICES.INGRESS.id,
        MICROSERVICES.ENTITY_EVENTS.id,
        MICROSERVICES.USER_ACTIONS_RECORDER.id,
        MICROSERVICES.FILES_PARSER.id,
        MICROSERVICES.INDEXER.id,
        MICROSERVICES.GRAPH.id,
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
    EntityEventsService,
    UserActionsService,
    FileParserService,
    GraphService,
    IndexerService,
  ],
  exports: [
    EntityEventsService,
    UserActionsService,
    FileParserService,
    GraphService,
    IndexerService,
  ],
})
export class RpcModule {}
