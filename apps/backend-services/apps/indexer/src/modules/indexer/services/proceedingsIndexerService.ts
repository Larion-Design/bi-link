import { Injectable, Logger } from '@nestjs/common'
import { ProceedingModel } from '@app/models'
import { INDEX_PROCEEDINGS, ProceedingIndex } from '@app/definitions'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { ConnectedEntityIndexerService } from './connectedEntityIndexerService'

@Injectable()
export class ProceedingsIndexerService {
  private readonly index = INDEX_PROCEEDINGS
  private readonly logger = new Logger(ProceedingsIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
  ) {}

  indexProceeding = async (proceedingId: string, proceedingModel: ProceedingModel) => {
    try {
      const { _id } = await this.elasticsearchService.index<ProceedingIndex>({
        index: this.index,
        id: proceedingId,
        document: this.createIndexData(proceedingModel),
        refresh: true,
      })

      this.logger.debug(`Added ${proceedingId} to index ${this.index}`)
      return _id === proceedingId
    } catch (e) {
      this.logger.error(e)
    }
  }

  private createIndexData = (proceedingModel: ProceedingModel) => ({
    name: proceedingModel.name,
    type: proceedingModel.type,
    fileNumber: proceedingModel.fileNumber,
    description: proceedingModel.description,
    year: proceedingModel.year,
    customFields: proceedingModel.customFields,
    files: [],
    persons: proceedingModel.entitiesInvolved
      .filter(({ person }) => !!person)
      .map(({ person }) => this.connectedEntityIndexerService.createConnectedPersonIndex(person)),
    companies: proceedingModel.entitiesInvolved
      .filter(({ company }) => !!company)
      .map(({ company }) =>
        this.connectedEntityIndexerService.createConnectedCompanyIndex(company),
      ),
  })
}
