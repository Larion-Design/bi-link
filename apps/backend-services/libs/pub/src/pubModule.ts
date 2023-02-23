import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MICROSERVICES } from '@app/pub/constants'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EntityEventsService } from '@app/pub/services/entityEventsService'
import { UserActionsService } from '@app/pub/services/userActionsService'
import { FileParserService } from '@app/pub/services/fileParserService'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MICROSERVICES.USER_ACTIONS_RECORDER.id,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          Promise.resolve({
            transport: Transport.REDIS,
            options: {
              host: configService.get('REDIS_HOST'),
              port: configService.get('REDIS_PORT'),
            },
          }),
      },
      {
        name: MICROSERVICES.ENTITY_EVENTS.id,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          Promise.resolve({
            transport: Transport.REDIS,
            options: {
              host: configService.get('REDIS_HOST'),
              port: configService.get('REDIS_PORT'),
            },
          }),
      },
      {
        name: MICROSERVICES.FILES_PARSER.id,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) =>
          Promise.resolve({
            transport: Transport.REDIS,
            options: {
              host: configService.get('REDIS_HOST'),
              port: configService.get('REDIS_PORT'),
            },
          }),
      },
    ]),
  ],
  providers: [EntityEventsService, UserActionsService, FileParserService],
  exports: [EntityEventsService, UserActionsService, FileParserService],
})
export class PubModule {}
