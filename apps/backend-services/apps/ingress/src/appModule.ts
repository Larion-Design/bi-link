import { CacheModule, Module } from '@nestjs/common'
import { RpcModule } from '@app/rpc'
import { ServiceHealthModule } from '@app/service-health'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { EntitiesModule } from './entities'
import { CreateEntityController } from './rpc/createEntityController'

@Module({
  imports: [
    RpcModule,
    EntitiesModule,
    ServiceHealthModule,
    CacheModule.register({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvVars: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        Promise.resolve({
          uri: configService.getOrThrow<string>('MONGODB_URI'),
        }),
    }),
  ],
  providers: [],
  controllers: [CreateEntityController],
})
export class AppModule {}
