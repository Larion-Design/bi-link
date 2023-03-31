import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { ActivityEvent } from 'defs'
import { MICROSERVICES } from '@app/rpc/constants'
import { IndexerService } from '@app/rpc/microservices/indexer/indexerService'

@Controller()
export class UserActionController {
  constructor(private readonly indexerService: IndexerService) {}

  @EventPattern(MICROSERVICES.ACTIVITY_HISTORY.recordAction)
  async recordUserAction(@Payload() activityEvent: ActivityEvent) {
    return this.indexerService.recordHistoryEvent(activityEvent)
  }
}
