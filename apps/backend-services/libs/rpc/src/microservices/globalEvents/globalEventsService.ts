import { GlobalEventsServiceMethods } from '@app/rpc/microservices/globalEvents/globalEventsServiceConfig'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { MICROSERVICES } from '@app/rpc/constants'
import { ClientProxy } from '@nestjs/microservices'
import { EntityInfo } from 'defs'

@Injectable()
export class GlobalEventsService {
  private readonly logger = new Logger(GlobalEventsService.name)

  constructor(@Inject(MICROSERVICES.GLOBAL.id) private client: ClientProxy) {}

  dispatchEntityCreated(entityInfo: EntityInfo) {
    try {
      type Params = Parameters<GlobalEventsServiceMethods['dispatchEntityCreated']>[0]
      type Result = ReturnType<GlobalEventsServiceMethods['dispatchEntityCreated']>

      this.client.emit<Result, Params>(MICROSERVICES.GLOBAL.entityCreated, entityInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }

  dispatchEntityUpdated(entityInfo: EntityInfo) {
    try {
      type Params = Parameters<GlobalEventsServiceMethods['dispatchEntityUpdated']>[0]
      type Result = ReturnType<GlobalEventsServiceMethods['dispatchEntityUpdated']>

      this.client.emit<Result, Params>(MICROSERVICES.GLOBAL.entityModified, entityInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
