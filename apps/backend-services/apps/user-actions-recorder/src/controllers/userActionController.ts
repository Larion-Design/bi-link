import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { HistoryIndexerService } from '../services/historyIndexerService'
import { ActivityEventIndex } from 'defs'
import { MICROSERVICES } from '@app/pub/constants'

@Controller()
export class UserActionController {
  constructor(private readonly historyIndexerService: HistoryIndexerService) {}

  @EventPattern(MICROSERVICES.USER_ACTIONS_RECORDER.recordUserAction)
  async recordUserAction(@Payload() userActionInfo: ActivityEventIndex) {
    return this.historyIndexerService.indexEvent(userActionInfo)
  }
}
