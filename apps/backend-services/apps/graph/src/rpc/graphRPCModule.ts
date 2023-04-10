import { Module } from '@nestjs/common'
import { ProducersModule } from '../producers/producersModule'
import { EntityUpserted } from './controllers/entityUpserted'
import { GetEntityRelationships } from './controllers/getEntityRelationships'
import { RefreshEntities } from './controllers/refreshEntities'

@Module({
  imports: [ProducersModule],
  controllers: [GetEntityRelationships, EntityUpserted, RefreshEntities],
})
export class GraphRPCModule {}
