import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@app/definitions/search/connectedEntity'
import { EventIndex, PartyIndex } from '@app/definitions/search/event'
import { LocationIndexerService } from '@app/search-tools-module/indexer/locationIndexerService'
import { Injectable, Logger } from '@nestjs/common'
import { format } from 'date-fns'
import { INDEX_EVENTS } from '@app/definitions/constants'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { EventModel } from '@app/entities/models/event/eventModel'
import { PartyModel } from '@app/entities/models/event/partyModel'
import { IncidentEventDispatcherService } from '../../../../apps/indexer/src/modules/producers/services/incidentEventDispatcherService'
import { EventsService } from '@app/entities/services/eventsService'
import { ConnectedEntityIndexerService } from './connectedEntityIndexerService'

@Injectable()
export class EventsIndexerService {
  private readonly index = INDEX_EVENTS
  private readonly logger = new Logger(EventsIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly incidentsService: EventsService,
    private readonly incidentEventDispatcherService: IncidentEventDispatcherService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
    private readonly locationIndexerService: LocationIndexerService,
  ) {}

  indexIncident = async (incidentId: string, incidentModel: EventModel) => {
    try {
      const { _id } = await this.elasticsearchService.index<EventIndex>({
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

  private createIndexData = (incident: EventModel): EventIndex => ({
    type: incident.type,
    date: format(incident.date, 'yyyy-MM-dd HH:mm:ss'),
    location: this.locationIndexerService.createLocationIndexData(incident.location),
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
