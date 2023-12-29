import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { ProcessedFileIndex } from '@modules/definitions'
import { EntityType } from 'defs'
import { TextExtractorService } from '@modules/files/services/textExtractorService'
import { formatDateTime } from 'tools'
import {
  INDEX_EVENTS,
  INDEX_COMPANIES,
  INDEX_FILES,
  INDEX_PROPERTIES,
  INDEX_PERSONS,
} from '../../constants'

@Injectable()
export class FilesIndexerService {
  private readonly index = INDEX_FILES
  private readonly logger = new Logger(FilesIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly textExtractService: TextExtractorService,
  ) {}

  private async indexFileContent(fileId: string, fileContent: string) {
    try {
      const { _id } = await this.elasticsearchService.index<ProcessedFileIndex>({
        index: this.index,
        id: fileId,
        document: this.createIndexData(fileContent),
        refresh: 'wait_for',
      })

      return _id === fileId
    } catch (error) {
      this.logger.error(error)
    }
  }

  private async getFileContent(fileId: string) {
    try {
      const indexedContentExists = await this.elasticsearchService.exists({
        index: this.index,
        id: fileId,
      })

      if (indexedContentExists) {
        const { found, _source } = await this.elasticsearchService.get<ProcessedFileIndex>({
          index: this.index,
          id: fileId,
          _source: ['content'] as Array<keyof ProcessedFileIndex>,
        })

        if (found && _source?.content) {
          return _source.content
        }
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createIndexData = (content: string): ProcessedFileIndex => ({
    content,
    processedDate: formatDateTime(new Date()),
  })

  private getIndexByEntityType(entityType: EntityType) {
    const entitiesIndicesMap = {
      PERSON: INDEX_PERSONS,
      COMPANY: INDEX_COMPANIES,
      EVENT: INDEX_EVENTS,
      PROPERTY: INDEX_PROPERTIES,
    }

    if (entityType in entitiesIndicesMap) {
      return String(entitiesIndicesMap[entityType])
    }
  }
}
