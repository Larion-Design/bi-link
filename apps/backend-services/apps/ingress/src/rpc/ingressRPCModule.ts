import { Module } from '@nestjs/common'
import { CreateEntity } from './controllers/createEntity'
import { GetEntities } from './controllers/getEntities'
import { GetEntity } from './controllers/getEntity'
import { GetReportsTemplates } from './controllers/getReportsTemplates'
import { UpdateEntity } from './controllers/updateEntity'

@Module({
  controllers: [CreateEntity, UpdateEntity, GetEntity, GetEntities, GetReportsTemplates],
})
export class IngressRPCModule {}
