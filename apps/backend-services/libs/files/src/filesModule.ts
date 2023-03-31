import { CacheModule, Module } from '@nestjs/common'
import { MinioModule } from 'nestjs-minio-client'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FileStorageService } from '@app/files/services/fileStorageService'
import { FileImporterService } from '@app/files/services/fileImporterService'

@Module({
  imports: [
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
  providers: [FileImporterService, FileStorageService],
  exports: [FileImporterService, FileStorageService],
})
export class FilesModule {}
