import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FileAPIOutput } from 'defs'
import { File } from '../dto/file'
import { DownloadUrl } from '../dto/downloadUrl'
import { FileStorageService } from '@app/files/services/fileStorageService'

@Resolver(() => File)
export class FileUrl {
  constructor(protected fileStorageService: FileStorageService) {}

  @ResolveField(() => DownloadUrl)
  async url(@Parent() { fileId }: FileAPIOutput) {
    return this.fileStorageService.getDownloadUrl(fileId, 120)
  }
}
