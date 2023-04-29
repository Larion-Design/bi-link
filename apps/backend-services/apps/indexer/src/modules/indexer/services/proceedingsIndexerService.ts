import { Injectable, Logger } from '@nestjs/common'
import { ConnectedCompanyIndex, ConnectedPersonIndex, ProceedingIndex } from '@app/definitions'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { Proceeding, ProceedingEntityInvolved } from 'defs'
import { formatYear } from 'tools'
import { INDEX_PROCEEDINGS } from '../../../constants'
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

  private createIndexData = (proceedingModel: Proceeding): ProceedingIndex => {
    const { persons, companies } = this.createConnectedEntitiesIndex(
      proceedingModel.entitiesInvolved,
    )

    return {
      name: proceedingModel.name,
      type: proceedingModel.type,
      fileNumber: proceedingModel.fileNumber.value,
      description: proceedingModel.description,
      year: proceedingModel.year.value ? formatYear(proceedingModel.year.value) : undefined,
      customFields: this.customFieldsIndexerService.createCustomFieldsIndex(
        proceedingModel.customFields,
      ),
      files: [],
      persons,
      companies,
    }
  }

  private createConnectedEntitiesIndex = (entities: ProceedingEntityInvolved[]) => {
    const persons: ConnectedPersonIndex[] = []
    const companies: ConnectedCompanyIndex[] = []

    entities.forEach(({ person, company }) => {
      if (person) {
        persons.push(this.connectedEntityIndexerService.createConnectedPersonIndex(person))
      } else if (company) {
        companies.push(this.connectedEntityIndexerService.createConnectedCompanyIndex(company))
      }
    })

    return { persons, companies }
  }
}
