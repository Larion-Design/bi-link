import { IndexerService } from '@app/rpc'
import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { ActivityEventIndex } from 'defs'
import { MICROSERVICES } from '@app/rpc/constants'

@Controller()
export class UserActionController {
  constructor(private readonly indexerService: IndexerService) {}

  @EventPattern(MICROSERVICES.ACTIVITY_HISTORY.recordAction)
  async recordUserAction(@Payload() userActionInfo: ActivityEventIndex) {
    return this.indexerService.recordHistoryEvent(userActionInfo)
  }
}
