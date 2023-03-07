import { EmbeddedFileIndex, ProcessedFileIndex } from '@app/definitions'
import { FileEventInfo, FileParentEntity } from '@app/scheduler-module'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { format } from 'date-fns'
import {
  INDEX_COMPANIES,
  INDEX_FILES,
  INDEX_EVENTS,
  INDEX_PERSONS,
  INDEX_PROPERTIES,
} from '@app/definitions'
import { FilesService } from '@app/models'
import { FileParserService } from '@app/rpc'

@Injectable()
export class FilesIndexerService {
  private readonly index = INDEX_FILES
  private readonly logger = new Logger(FilesIndexerService.name)

  constructor(
    private readonly fileParserService: FileParserService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly filesService: FilesService,
  ) {}

  appendFileContent = async ({ fileId, linkedEntity }: FileEventInfo) => {
    try {
      let indexedFileContent = await this.getFileContent(fileId)

      if (!indexedFileContent) {
        const textContent = await this.fileParserService.extractText(fileId)
        await this.indexFileContent(fileId, textContent)
        indexedFileContent = textContent
      }

      if (linkedEntity) {
        const { id, type } = linkedEntity
        const { name, description } = await this.filesService.getFile(fileId)

        const docFileContent: EmbeddedFileIndex = {
          name,
          description,
          content: indexedFileContent ?? '',
        }

        const { result } = await this.elasticsearchService.update({
          id,
          index: this.getIndexByEntityType(type),
          refresh: true,
          retry_on_conflict: 10,
          script: {
            source: 'ctx._source.files.addAll(params.files)',
            lang: 'painless',
            params: {
              files: [docFileContent],
            },
          },
        })
        return result === 'updated'
      }
      return true
    } catch (error) {
      this.logger.error(error)
    }
  }

  private indexFileContent = async (fileId: string, fileContent: string) => {
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

  private getFileContent = async (fileId: string) => {
    try {
      const indexedContentExists = await this.elasticsearchService.exists({
        index: this.index,
        id: fileId,
      })

      if (indexedContentExists) {
        const {
          found,
          _source: { content },
        } = await this.elasticsearchService.get<ProcessedFileIndex>({
          index: this.index,
          id: fileId,
          _source: ['content'] as Array<keyof ProcessedFileIndex>,
        })

        if (found) {
          return content
        }
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createIndexData = (content: string): ProcessedFileIndex => ({
    content,
    processedDate: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
  })

  private getIndexByEntityType = (entityType: FileParentEntity) => {
    const entitiesIndicesMap = {
      [FileParentEntity.PERSON]: INDEX_PERSONS,
      [FileParentEntity.COMPANY]: INDEX_COMPANIES,
      [FileParentEntity.EVENT]: INDEX_EVENTS,
      [FileParentEntity.PROPERTY]: INDEX_PROPERTIES,
    }
    return entitiesIndicesMap[entityType]
  }
}
