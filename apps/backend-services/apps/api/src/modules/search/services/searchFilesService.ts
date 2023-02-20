import { ProcessedFileIndex } from '@app/definitions/search/file'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { INDEX_FILES } from '@app/definitions/constants'

@Injectable()
export class SearchFilesService {
  private readonly index = INDEX_FILES
  private readonly logger = new Logger(SearchFilesService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  getFileContent = async (fileId: string) => {
    try {
      const {
        _source: { content },
      } = await this.elasticsearchService.get<ProcessedFileIndex>({
        index: this.index,
        id: fileId,
      })

      return content
    } catch (e) {
      this.logger.error(e)
    }
  }
}
