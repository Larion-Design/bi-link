import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class MappingValidatorService {
  private readonly logger = new Logger(MappingValidatorService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  private indexExists = async (index: string) => {
    try {
      return this.elasticsearchService.indices.exists({
        index,
        allow_no_indices: true,
      })
    } catch (error) {
      this.logger.error(error)
    }
  }

  private createIndex = async (index: string, mapping: Record<string, MappingProperty>) => {
    try {
      this.logger.log(`Creating index ${index}`)
      const response = await this.elasticsearchService.indices.create({
        index,
        mappings: {
          dynamic: true,
          properties: mapping,
        },
      })
      this.logger.log(`Created index ${index}`)
      return response.acknowledged
    } catch (error) {
      this.logger.error(error)
    }
  }

  private deleteMapping = async (index: string) => {
    try {
      this.logger.log(`Removing index ${index}`)
      const { acknowledged } = await this.elasticsearchService.indices.delete({ index })
      return acknowledged
    } catch (e) {
      this.logger.error(e)
    }
  }

  initIndex = async (index: string, mapping: Record<string, MappingProperty>) => {
    try {
      if (await this.indexExists(index)) {
        await this.deleteMapping(index)
      }
      return this.createIndex(index, mapping)
    } catch (error) {
      this.logger.error(error)
    }
    return false
  }
}
