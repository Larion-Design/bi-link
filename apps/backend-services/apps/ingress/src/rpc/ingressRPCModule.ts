import { Module } from '@nestjs/common'
import { CreateEntity } from './controllers/createEntity'
import { CreatePendingSnapshot } from './controllers/createPendingSnapshot'
import { FindCompanyId } from './controllers/findCompanyId'
import { FindPersonId } from './controllers/findPersonId'
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
    FindPersonId,
    FindCompanyId,
  ],
})
export class IngressRPCModule {}
