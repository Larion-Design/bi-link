import { Module } from '@nestjs/common'
import { MinioModule } from 'nestjs-minio-client'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FileStorageService } from '@app/files/services/fileStorageService'
import { FileImporterService } from '@app/files/services/fileImporterService'
import { EntitiesModule } from '@app/models'

@Module({
  imports: [
    EntitiesModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        endPoint: config.get('MINIO_ENDPOINT'),
        port: parseInt(config.get('MINIO_PORT')),
        useSSL: false,
        accessKey: config.get('MINIO_ACCESS_KEY'),
        secretKey: config.get('MINIO_SECRET_KEY'),
        region: config.get('MINIO_REGION'),
        pathStyle: true,
      }),
    }),
  ],
  providers: [FileImporterService, FileStorageService],
  exports: [FileImporterService, FileStorageService],
})
export class FilesModule {}
