import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { MappingProperty } from '@elastic/elasticsearch/lib/api/types'

@Injectable()
export class MappingValidatorService {
  private readonly logger = new Logger(MappingValidatorService.name)

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  private indexExists = async (index: string) => {
    return this.elasticsearchService.indices.exists({
      index,
      allow_no_indices: true,
    })
  }

  private createIndex = async (index: string, mapping: Record<string, MappingProperty>) => {
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
  }

  private deleteMapping = async (index: string) => {
    this.logger.log(`Removing index ${index}`)
    const { acknowledged } = await this.elasticsearchService.indices.delete({
      index,
    })

    this.logger.log(`Removed index ${index}: ${String(acknowledged)}`)
    return acknowledged
  }

  initIndex = async (index: string, mapping: Record<string, MappingProperty>) => {
    if (!(await this.indexExists(index))) {
      await this.createIndex(index, mapping)
    }
  }
}
