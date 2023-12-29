import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { MinioService } from 'nestjs-minio-client'
import { ConfigService } from '@nestjs/config'
import { CacheService } from '../../cache'

@Injectable()
export class FileStorageService implements OnApplicationBootstrap {
  private readonly logger = new Logger(FileStorageService.name)
  private readonly bucketName: string
  private readonly minioInternalUrl: string
  private readonly minioPublicUrl: string
  private readonly region: string

  constructor(
    private readonly minioService: MinioService,
    private readonly cacheService: CacheService,
    configService: ConfigService,
  ) {
    const endpoint = configService.getOrThrow<string>('MINIO_ENDPOINT')
    const port = configService.getOrThrow<string>('MINIO_PORT')

    this.bucketName = configService.getOrThrow<string>('MINIO_BUCKET')
    this.minioInternalUrl = `${endpoint}:${port}`
    this.minioPublicUrl = configService.getOrThrow<string>('MINIO_PUBLIC_URL')
    this.region = configService.getOrThrow<string>('MINIO_REGION')
  }

  private validateBucket = async () => {
    this.logger.debug(`Checking whether the bucket ${this.bucketName} exists`)

    if (!(await this.minioService.client.bucketExists(this.bucketName))) {
      this.logger.debug(`Bucket ${this.bucketName} will be created`)
      await this.minioService.client.makeBucket(this.bucketName, this.region)
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
      const cachedUrl = await this.getCachedUrl(fileId)

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
      return Promise.all(filesIds.map((fileId) => this.getDownloadUrl(fileId, ttl)))
    } catch (error) {
      this.logger.error(error)
    }
  }

  private transformUrl = (privateUrl: string) =>
    privateUrl.replace(this.minioInternalUrl, this.minioPublicUrl)

  private getCachedUrl = async (fileId: string) =>
    this.cacheService.get(this.getFileUrlCacheKey(fileId))

  private cacheFileUrl = async (fileId: string, url: string, ttl: number) =>
    this.cacheService.set(this.getFileUrlCacheKey(fileId), url, ttl)

  private getFileUrlCacheKey = (fileId: string) => `files:${fileId}}`

  async onApplicationBootstrap() {
    await this.validateBucket()
  }
}
