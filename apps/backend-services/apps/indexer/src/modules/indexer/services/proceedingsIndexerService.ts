import { Injectable, Logger } from '@nestjs/common'
import { INDEX_PROCEEDINGS, ProceedingIndex } from '@app/definitions'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { Proceeding } from 'defs'
import { ConnectedEntityIndexerService } from './connectedEntityIndexerService'
import { CustomFieldsIndexerService } from './customFieldsIndexerService'

@Injectable()
export class ProceedingsIndexerService {
  private readonly index = INDEX_PROCEEDINGS
  private readonly logger = new Logger(ProceedingsIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
    private readonly customFieldsIndexerService: CustomFieldsIndexerService,
  ) {}

  indexProceeding = async (proceedingId: string, proceedingModel: Proceeding) => {
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

  private createIndexData = (proceedingModel: Proceeding): ProceedingIndex => ({
    name: proceedingModel.name,
    type: proceedingModel.type,
    fileNumber: proceedingModel.fileNumber.value,
    description: proceedingModel.description,
    year: proceedingModel.year.value,
    customFields: this.customFieldsIndexerService.createCustomFieldsIndex(
      proceedingModel.customFields,
    ),
    files: [],
    persons: proceedingModel.entitiesInvolved
      .filter(({ person }) => !!person)
      .map(({ person }) => this.connectedEntityIndexerService.createConnectedPersonIndex(person!)),
    companies: proceedingModel.entitiesInvolved
      .filter(({ company }) => !!company)
      .map(({ company }) =>
        this.connectedEntityIndexerService.createConnectedCompanyIndex(company!),
      ),
  })
}
