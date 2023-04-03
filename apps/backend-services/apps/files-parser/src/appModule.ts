import { Module } from '@nestjs/common'
import { ServiceHealthModule } from '@app/service-health'
import { ConfigModule } from '@nestjs/config'
import { ProcessFileController } from './rpc/processFileController'
import { ParserService } from './services/parserService'

@Module({
  imports: [
    ServiceHealthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
    }),
  ],
  controllers: [ProcessFileController],
  providers: [ParserService],
})
export class AppModule {}
