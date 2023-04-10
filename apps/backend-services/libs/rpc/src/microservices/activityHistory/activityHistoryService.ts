import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ActivityEventIndex } from '@app/definitions/indexer/activityEvent'
import { MICROSERVICES } from '@app/rpc/constants'
import { ActivityHistoryServiceMethods } from '@app/rpc/microservices/activityHistory/activityHistoryServiceConfig'
import { lastValueFrom, timeout } from 'rxjs'

@Injectable()
export class ActivityHistoryService {
  private readonly logger = new Logger(ActivityHistoryService.name)

  constructor(@Inject(MICROSERVICES.ACTIVITY_HISTORY.id) private readonly client: ClientProxy) {}

  recordAction = (actionInfo: Required<ActivityEventIndex>) => {
    try {
      type Params = Parameters<ActivityHistoryServiceMethods['recordAction']>[0]
      type Result = ReturnType<ActivityHistoryServiceMethods['recordAction']>

      this.client.emit<Result, Params>(MICROSERVICES.ACTIVITY_HISTORY.recordAction, actionInfo)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getActivityEvents = (startDate: Date, endDate: Date) => {
    try {
      type Params = Parameters<ActivityHistoryServiceMethods['getActivityEvents']>[0]
      type Result = ReturnType<ActivityHistoryServiceMethods['getActivityEvents']>

      return lastValueFrom(
        this.client
          .send<Result, Params>(MICROSERVICES.GRAPH.getEntityRelationships, {
            startDate,
            endDate,
          })
          .pipe(timeout(1000)),
      )
    } catch (e) {
      this.logger.error(e)
    }
  }
}
