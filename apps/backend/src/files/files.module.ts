import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { CacheModule } from '../cache';
import { FileImporterService } from './services/fileImporterService';
import { FileStorageService } from './services/fileStorageService';
import { TextExtractorService } from './services/textExtractorService';

const providers: Provider[] = [
  FileImporterService,
  FileStorageService,
  TextExtractorService,
];

@Global()
@Module({
  imports: [
    CacheModule,
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
  providers,
  exports: providers,
})
export class FilesModule {}
