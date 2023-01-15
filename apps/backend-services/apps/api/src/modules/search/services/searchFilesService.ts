import { INDEX_FILES, INDEX_INCIDENTS } from '@app/definitions/constants'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { ProcessedFileIndex } from 'defs'
import { SearchHelperService } from './searchHelperService'

@Injectable()
export class SearchFilesService {
  private readonly index = INDEX_FILES
  private readonly logger = new Logger(SearchFilesService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly searchHelperService: SearchHelperService,
  ) {}

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
