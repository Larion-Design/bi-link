import { PubModule } from '@app/pub'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ServiceHealthModule } from '@app/service-health'
import { UserActionController } from './userActionController'

@Module({
  imports: [
    PubModule,
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
