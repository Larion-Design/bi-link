import { Module } from '@nestjs/common'
import { FilesModule } from '../files/filesModule'
import { ExtractTextFromFile } from './controllers/extractTextFromFile'
import { GetDownloadUrls } from './controllers/getDownloadUrls'
import { UploadFile } from './controllers/uploadFile'

@Module({
  imports: [FilesModule],
  controllers: [UploadFile, GetDownloadUrls, ExtractTextFromFile],
})
export class FilesManagerRPCModule {}
