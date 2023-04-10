import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { MinioService } from 'nestjs-minio-client'
import { ConfigService } from '@nestjs/config'
import { BUCKET_FILES } from '../constants'

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name)
  private readonly bucketName: string = BUCKET_FILES
  private readonly minioInternalUrl: string
  private readonly minioPublicUrl: string

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {
    this.minioInternalUrl = `${configService.getOrThrow<string>(
      'MINIO_ENDPOINT',
    )}:${configService.getOrThrow<string>('MINIO_PORT')}`

    this.minioPublicUrl = configService.getOrThrow<string>('MINIO_PUBLIC_URL')

    void this.validateBucket()
  }

  private validateBucket = async () => {
    this.logger.debug(`Checking whether the bucket ${this.bucketName} exists`)

    if (!(await this.minioService.client.bucketExists(this.bucketName))) {
      this.logger.debug(`Bucket ${this.bucketName} will be created`)
      await this.minioService.client.makeBucket(
        this.bucketName,
        this.configService.getOrThrow('MINIO_REGION'),
      )
      this.logger.debug(`Bucket ${this.bucketName} was created`)
    } else this.logger.debug(`Bucket ${this.bucketName} is online`)
  }

  getFileContent = async (fileId: string): Promise<Buffer> => {
    const chunks: Buffer[] = []
    const stream = await this.minioService.client.getObject(this.bucketName, fileId)

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk: string) => chunks.push(Buffer.from(chunk)))
      stream.on('error', (err) => reject(err))
      stream.on('end', () => resolve?.(Buffer.concat(chunks)))
    })
  }

  uploadFile = async (fileId: string, buffer: Buffer) => {
    try {
      await this.minioService.client.putObject(this.bucketName, fileId, buffer)
      return true
    } catch (e) {
      this.logger.error(e)
    }
  }

  setFileTags = async (fileId: string, tags: Record<string, string>) => {
    try {
      await this.minioService.client.setObjectTagging(this.bucketName, fileId, tags)
      return true
    } catch (error) {
      this.logger.error(error)
    }
  }

  getDownloadUrl = async (fileId: string, ttl = 120) => {
    try {
      let cachedUrl = await this.getCachedUrl(fileId)

      if (!cachedUrl) {
        const newUrl = this.transformUrl(
          await this.minioService.client.presignedGetObject(this.bucketName, fileId, ttl),
        )
        await this.cacheFileUrl(fileId, newUrl, ttl)
        return { url: newUrl, ttl }
      }
      return { url: cachedUrl, ttl }
    } catch (error) {
      this.logger.error(error)
    }
  }

  getDownloadUrls = async (filesIds: string[], ttl = 300) => {
    try {
      return Promise.allSettled(filesIds.map((fileId) => this.getDownloadUrl(fileId, ttl)))
    } catch (error) {
      this.logger.error(error)
    }
  }

  private transformUrl = (privateUrl: string) =>
    privateUrl.replace(this.minioInternalUrl, this.minioPublicUrl)

  private getCachedUrl = (fileId: string) =>
    this.cacheManager.get<string>(this.getFileUrlCacheKey(fileId))

  private getFileUrlCacheKey = (fileId: string) => `/files/download/${fileId}}`

  private cacheFileUrl = (fileId: string, url: string, ttl: number) =>
    this.cacheManager.set(this.getFileUrlCacheKey(fileId), url, { ttl })
}
