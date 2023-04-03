import { RpcModule } from '@app/rpc'
import { CacheModule, Module } from '@nestjs/common'
import { MinioModule } from 'nestjs-minio-client'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FileRPCController } from './rpc/fileRPCController'
import { FileImporterService } from './services/fileImporterService'
import { FileStorageService } from './services/fileStorageService'

@Module({
  imports: [
    RpcModule,
    CacheModule.register({
      isGlobal: true,
    }),
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        endPoint: config.getOrThrow('MINIO_ENDPOINT'),
        port: parseInt(config.getOrThrow('MINIO_PORT')),
        useSSL: false,
        accessKey: config.getOrThrow('MINIO_ACCESS_KEY'),
        secretKey: config.getOrThrow('MINIO_SECRET_KEY'),
        region: config.getOrThrow('MINIO_REGION'),
        pathStyle: true,
      }),
    }),
  ],
  controllers: [FileRPCController],
  providers: [FileImporterService, FileStorageService],
  exports: [FileImporterService, FileStorageService],
})
export class AppModule {}
