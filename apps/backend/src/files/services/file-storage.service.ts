import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { MinioService } from 'nestjs-minio-client'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FileStorageService implements OnApplicationBootstrap {
  private readonly logger = new Logger(FileStorageService.name)
  private readonly bucketName: string
  private readonly minioInternalUrl: string
  private readonly minioPublicUrl: string
  private readonly region: string

  constructor(
    private readonly minioService: MinioService,
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
    await this.minioService.client.putObject(this.bucketName, fileId, buffer)
    return true
  }

  setFileTags = async (fileId: string, tags: Record<string, string>) => {
    await this.minioService.client.setObjectTagging(this.bucketName, fileId, tags)
    return true
  }

  async getDownloadUrl(fileId: string, ttl = 120) {
    const fileUrl = await this.minioService.client.presignedGetObject(this.bucketName, fileId, ttl)
    this.logger.debug(`Retrieved url ${fileUrl}`)
    const newUrl = this.transformUrl(fileUrl)
    return { url: newUrl, ttl }
  }

  async getDownloadUrls(filesIds: string[], ttl = 300) {
    return Promise.all(filesIds.map((fileId) => this.getDownloadUrl(fileId, ttl)))
  }

  private transformUrl(privateUrl: string) {
    return privateUrl.replace('http://minio:9000', this.minioPublicUrl)
  }

  async onApplicationBootstrap() {
    await this.validateBucket()
  }
}
