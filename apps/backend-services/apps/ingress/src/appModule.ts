import { Module } from '@nestjs/common'
import { RpcModule } from '@app/rpc'
import { ServiceHealthModule } from '@app/service-health'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { IngressCacheModule } from './cache'
import { EntitiesModule } from './entities'
import { IngressRPCModule } from './rpc/ingressRPCModule'

@Module({
  imports: [
    RpcModule,
    IngressCacheModule,
    EntitiesModule,
    IngressRPCModule,
    ServiceHealthModule,
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
})
export class AppModule {}
