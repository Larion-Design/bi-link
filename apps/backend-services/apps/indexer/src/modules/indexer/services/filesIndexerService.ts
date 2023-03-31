import { EmbeddedFileIndex, ProcessedFileIndex } from '@app/definitions'
import { FileParserService } from '@app/rpc/microservices/filesParser/fileParserService'
import { IngressService } from '@app/rpc/microservices/ingress'
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
import { File } from 'defs'

@Injectable()
export class FilesIndexerService {
  private readonly index = INDEX_FILES
  private readonly logger = new Logger(FilesIndexerService.name)

  constructor(
    private readonly fileParserService: FileParserService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly ingressService: IngressService,
  ) {}

  appendFileContent = async ({ fileId, linkedEntity }: FileEventInfo) => {
    try {
      let indexedFileContent = await this.getFileContent(fileId)

      if (!indexedFileContent) {
        const textContent = await this.fileParserService.extractText(fileId)

        if (textContent) {
          await this.indexFileContent(fileId, textContent)
          indexedFileContent = textContent
        }
      }

      if (linkedEntity) {
        const { id, type } = linkedEntity
        const fileModel = await this.ingressService.getEntity(
          {
            entityId: fileId,
            entityType: 'FILE',
          },
          false,
          {
            type: 'SERVICE',
            sourceId: 'SERVICE_INDEXER',
          },
        )

        if (fileModel) {
          const { name, description } = fileModel as File

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
