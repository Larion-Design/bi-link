import { Injectable, Logger } from '@nestjs/common'
import { format } from 'date-fns'
import { INDEX_INCIDENTS } from '@app/definitions/constants'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { IncidentModel } from '@app/entities/models/incidentModel'
import { IncidentIndex } from '@app/definitions/incident'
import { PartyModel } from '@app/entities/models/partyModel'
import { PartyIndex } from '@app/definitions/party'
import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@app/definitions/connectedEntity'
import { IncidentEventDispatcherService } from '../../../producers/services/incidentEventDispatcherService'
import { IncidentsService } from '@app/entities/services/incidentsService'
import { ConnectedEntityIndexerService } from '../../shared/services/connectedEntityIndexerService'

@Injectable()
export class IncidentsIndexerService {
  private readonly index = INDEX_INCIDENTS
  private readonly logger = new Logger(IncidentsIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly incidentsService: IncidentsService,
    private readonly incidentEventDispatcherService: IncidentEventDispatcherService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
  ) {}

  indexIncident = async (incidentId: string, incidentModel: IncidentModel) => {
    try {
      const { _id } = await this.elasticsearchService.index<IncidentIndex>({
        index: this.index,
        id: incidentId,
        document: this.createIndexData(incidentModel),
        refresh: true,
      })

      this.logger.debug(`Added ${incidentId} to index ${this.index}`)
      return _id === incidentId
    } catch (error) {
      this.logger.error(error)
    }
  }

  indexAllIncidents = async () => {
    const incidentsIds: string[] = []

    for await (const { _id } of this.incidentsService.getAllIncidents()) {
      incidentsIds.push(String(_id))
    }

    if (incidentsIds.length) {
      return this.incidentEventDispatcherService.dispatchIncidentsUpdated(incidentsIds)
    }
  }

  private createIndexData = (incident: IncidentModel): IncidentIndex => ({
    type: incident.type,
    date: format(incident.date, 'yyyy-MM-dd HH:mm:ss'),
    location: incident.location,
    description: incident.description,
    parties: this.createPartiesIndex(incident.parties),
    customFields: incident.customFields,
    files: [],
    persons: this.createPartyPersonsIndex(incident.parties),
    companies: this.createPartyCompaniesIndex(incident.parties),
    properties: this.createPartyPropertiesIndex(incident.parties),
  })

  private createPartiesIndex = (parties: PartyModel[]): PartyIndex[] =>
    parties.map((partyModel) => ({
      name: partyModel.name,
      description: partyModel.description,
      customFields: partyModel.customFields,
    }))

  private createPartyCompaniesIndex = (parties: PartyModel[]): ConnectedCompanyIndex[] => {
    const companiesMap = new Map<string, ConnectedCompanyIndex>()

    parties.forEach(({ companies }) =>
      companies.forEach((companyDocument) => {
        const companyIndex =
          this.connectedEntityIndexerService.createConnectedCompanyIndex(companyDocument)
        companiesMap.set(companyIndex._id, companyIndex)
      }),
    )
    return Array.from(companiesMap.values())
  }

  private createPartyPropertiesIndex = (parties: PartyModel[]): ConnectedPropertyIndex[] => {
    const propertiesMap = new Map<string, ConnectedPropertyIndex>()

    parties.forEach(({ properties }) =>
      properties.forEach((propertyDocument) => {
        const propertyIndex =
          this.connectedEntityIndexerService.createConnectedPropertyIndex(propertyDocument)
        propertiesMap.set(propertyIndex._id, propertyIndex)
      }),
    )
    return Array.from(propertiesMap.values())
  }

  private createPartyPersonsIndex = (parties: PartyModel[]): ConnectedPersonIndex[] => {
    const personsMap = new Map<string, ConnectedPersonIndex>()

    parties.forEach(({ persons }) =>
      persons.forEach((personDocument) => {
        const personIndex =
          this.connectedEntityIndexerService.createConnectedPersonIndex(personDocument)
        personsMap.set(personIndex._id, personIndex)
      }),
    )
    return Array.from(personsMap.values())
  }
}
