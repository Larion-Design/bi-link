import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { File } from '../dto/file'
import { DownloadUrl } from '../dto/downloadUrl'
import { FileDocument } from '@app/models/models/fileModel'
import { FileStorageService } from '@app/files/services/fileStorageService'

@Resolver(() => File)
export class FileUrl {
  constructor(protected fileStorageService: FileStorageService) {}

  @ResolveField(() => DownloadUrl)
  async url(@Parent() file: FileDocument) {
    return this.fileStorageService.getDownloadUrl(file.fileId, 3600)
  }
}
