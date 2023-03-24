import { Module } from '@nestjs/common'
import { EntitiesModule } from '@app/models'
import { RpcModule } from '@app/rpc'
import { ServiceHealthModule } from '@app/service-health'

@Module({
  imports: [EntitiesModule, RpcModule, ServiceHealthModule],
  providers: [],
  controllers: [],
})
export class AppModule {}
