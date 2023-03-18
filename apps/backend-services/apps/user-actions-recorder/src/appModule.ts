import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RpcModule } from '@app/rpc'
import { ServiceHealthModule } from '@app/service-health'
import { UserActionController } from './userActionController'

@Module({
  imports: [
    RpcModule,
    ServiceHealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
    }),
  ],
  controllers: [UserActionController],
})
export class AppModule {}
