import { Module } from '@nestjs/common'
import { GraphSchedulerModule } from '../scheduler/graphSchedulerModule'
import { EntityUpserted } from './controllers/entityUpserted'
import { GetEntityRelationships } from './controllers/getEntityRelationships'
import { RefreshEntities } from './controllers/refreshEntities'

@Module({
  imports: [GraphSchedulerModule],
  controllers: [GetEntityRelationships, EntityUpserted, RefreshEntities],
})
export class GraphRPCModule {}
