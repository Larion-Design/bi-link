import { Module } from '@nestjs/common'
import { CreateEntity } from './controllers/createEntity'
import { CreatePendingSnapshot } from './controllers/createPendingSnapshot'
import { GetEntities } from './controllers/getEntities'
import { GetEntity } from './controllers/getEntity'
import { GetPendingSnapshot } from './controllers/getPendingSnapshot'
import { GetReportsTemplates } from './controllers/getReportsTemplates'
import { RemovePendingSnapshot } from './controllers/removePendingSnapshot'
import { UpdateEntity } from './controllers/updateEntity'

@Module({
  controllers: [
    CreateEntity,
    UpdateEntity,
    GetEntity,
    GetEntities,
    GetReportsTemplates,
    GetPendingSnapshot,
    CreatePendingSnapshot,
    RemovePendingSnapshot,
  ],
})
export class IngressRPCModule {}
