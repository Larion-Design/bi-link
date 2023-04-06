import { FilesManagerService } from '@app/rpc/microservices/filesManager/filesManagerService'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { FileAPIOutput } from 'defs'
import { File } from '../dto/file'
import { DownloadUrl } from '../dto/downloadUrl'

@Resolver(() => File)
export class FileUrl {
  constructor(protected filesManagerService: FilesManagerService) {}

  @ResolveField(() => DownloadUrl)
  async url(@Parent() { fileId }: FileAPIOutput) {
    return this.filesManagerService.getFileDownloadUrl(fileId, 120)
  }
}
