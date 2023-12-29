import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FileAPIOutput } from 'defs'
import { FileStorageService } from '@modules/files/services//fileStorageService'
import { File } from '../dto/file'
import { DownloadUrl } from '../dto/downloadUrl'

@Resolver(() => File)
export class FileUrl {
  constructor(protected filesManagerService: FileStorageService) {}

  @ResolveField(() => DownloadUrl)
  async url(@Parent() { fileId }: FileAPIOutput) {
    return this.filesManagerService.getDownloadUrl(fileId, 120)
  }
}
