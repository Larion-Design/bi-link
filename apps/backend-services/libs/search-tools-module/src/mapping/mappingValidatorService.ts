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
      this.logger.debug(`Elasticsearch will create index ${index}`)
      const response = await this.elasticsearchService.indices.create({
        index,
        mappings: {
          dynamic: true,
          properties: mapping,
        },
      })
      this.logger.debug(`Elasticsearch successfully created index ${index}`)
      return response.acknowledged
    } catch (error) {
      this.logger.error(error)
    }
  }

  private updateIndex = async (index: string, mapping: Record<string, MappingProperty>) => {
    try {
      const { acknowledged } = await this.elasticsearchService.indices.putMapping({
        index,
        dynamic: false,
        properties: mapping,
      })

      if (acknowledged) {
        this.logger.debug(`Updated mapping for ${index} doesn't require full index rebuild`)
      }
      return !acknowledged
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.body?.error.type === 'illegal_argument_exception') {
        return this.migrateMapping(index, mapping)
      } else this.logger.error(error)
    }
    return false
  }

  private migrateMapping = async (index: string, mapping: Record<string, MappingProperty>) => {
    try {
      this.logger.debug(`Removing index ${index}.`)
      await this.elasticsearchService.indices.delete({ index })

      this.logger.debug(`Recreating index ${index} with updated mapping.`)
      return this.createIndex(index, mapping)
    } catch (error) {
      this.logger.error(error)
    }
    return false
  }

  initIndex = async (index: string, mapping: Record<string, MappingProperty>) => {
    try {
      if (await this.indexExists(index)) {
        return this.updateIndex(index, mapping)
      }
      return this.createIndex(index, mapping)
    } catch (error) {
      this.logger.error(error)
    }
    return false
  }
}
