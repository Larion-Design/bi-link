import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ActivityEventIndex } from 'defs'
import { MICROSERVICES } from '@app/pub/constants'

@Injectable()
export class UserActionsService {
  private readonly logger = new Logger(UserActionsService.name)

  constructor(@Inject(MICROSERVICES.USER_ACTIONS_RECORDER.id) private client: ClientProxy) {}

  recordAction(actionInfo: ActivityEventIndex) {
    try {
      this.client.emit(MICROSERVICES.USER_ACTIONS_RECORDER.recordUserAction, actionInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }
}
