import { Module } from '@nestjs/common'
import { RpcModule } from '@app/rpc'
import { ServiceHealthModule } from '@app/service-health'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { EntitiesModule } from './entities'

@Module({
  imports: [
    RpcModule,
    EntitiesModule,
    ServiceHealthModule,
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
  controllers: [],
})
export class AppModule {}
