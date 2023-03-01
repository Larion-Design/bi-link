import { Injectable } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import { EntityInfo, MICROSERVICES } from '@app/pub/constants'

@Injectable()
export class GraphEventsController {
  @EventPattern(MICROSERVICES.GRAPH.entityCreated)
  async entityCreated(@Payload() entityInfo: EntityInfo) {
    return this.updateEntityDocument(entityInfo)
  }

  @EventPattern(MICROSERVICES.GRAPH.entityModified)
  async entityModified(@Payload() entityInfo: EntityInfo) {
    return this.updateEntityDocument(entityInfo)
  }

  private updateEntityDocument = async ({ entityId, entityType }: EntityInfo) =>
    Promise.reject('Not implemented')
}
