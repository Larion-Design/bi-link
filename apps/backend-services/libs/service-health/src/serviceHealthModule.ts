import { Module } from '@nestjs/common'
import { ServiceHealthController } from './serviceHealthController'

@Module({
  providers: [ServiceHealthController],
  controllers: [ServiceHealthController],
})
export class ServiceHealthModule {}
