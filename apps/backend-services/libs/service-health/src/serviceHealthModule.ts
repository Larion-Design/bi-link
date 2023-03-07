import { Global, Module } from '@nestjs/common'
import { ServiceHealthController } from './serviceHealthController'

@Global()
@Module({
  providers: [ServiceHealthController],
  controllers: [ServiceHealthController],
})
export class ServiceHealthModule {}
