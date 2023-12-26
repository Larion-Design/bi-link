import { Injectable, Logger } from '@nestjs/common';
import { format } from 'date-fns';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  EventIndex,
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  ConnectedPropertyIndex,
} from '@modules/definitions';
import { Event, EventParticipant } from 'defs';
import { formatDateTime } from 'tools';
import { INDEX_EVENTS } from '../../constants';
import { CustomFieldsIndexerService } from './customFieldsIndexerService';
import { LocationIndexerService } from './locationIndexerService';
import { ConnectedEntityIndexerService } from './connectedEntityIndexerService';

@Injectable()
export class EventsIndexerService {
  private readonly index = INDEX_EVENTS;
  private readonly logger = new Logger(EventsIndexerService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
    private readonly locationIndexerService: LocationIndexerService,
    private readonly customFieldsIndexerService: CustomFieldsIndexerService,
  ) {}

  async indexEvent(eventId: string, eventModel: Event) {
    try {
      const { _id } = await this.elasticsearchService.index<EventIndex>({
        index: this.index,
        id: eventId,
        document: this.createIndexData(eventModel),
        refresh: true,
      });

      this.logger.debug(`Added ${eventId} to index ${this.index}`);
      return _id === eventId;
    } catch (error) {
      this.logger.error(error);
    }
  }

  private createIndexData = (event: Event): EventIndex => ({
    type: event.type.value,
    date: event.date.value
      ? formatDateTime(new Date(event.date.value))
      : undefined,
    location: event.location
      ? this.locationIndexerService.createLocationIndexData(event.location)
      : undefined,
    description: event.description,
    customFields: this.customFieldsIndexerService.createCustomFieldsIndex(
      event.customFields,
    ),
    files: [],
    persons: this.createPartyPersonsIndex(event.parties),
    companies: this.createPartyCompaniesIndex(event.parties),
    properties: this.createPartyPropertiesIndex(event.parties),
  });

  private createPartyCompaniesIndex(
    parties: EventParticipant[],
  ): ConnectedCompanyIndex[] {
    const companiesMap = new Map<string, ConnectedCompanyIndex>();

    parties.forEach(({ companies }) =>
      companies.forEach((companyDocument) => {
        const companyIndex =
          this.connectedEntityIndexerService.createConnectedCompanyIndex(
            companyDocument,
          );
        companiesMap.set(companyIndex._id, companyIndex);
      }),
    );
    return Array.from(companiesMap.values());
  }

  private createPartyPropertiesIndex(
    parties: EventParticipant[],
  ): ConnectedPropertyIndex[] {
    const propertiesMap = new Map<string, ConnectedPropertyIndex>();

    parties.forEach(({ properties }) =>
      properties.forEach((propertyDocument) => {
        const propertyIndex =
          this.connectedEntityIndexerService.createConnectedPropertyIndex(
            propertyDocument,
          );
        propertiesMap.set(propertyIndex._id, propertyIndex);
      }),
    );
    return Array.from(propertiesMap.values());
  }

  private createPartyPersonsIndex(
    parties: EventParticipant[],
  ): ConnectedPersonIndex[] {
    const personsMap = new Map<string, ConnectedPersonIndex>();

    parties.forEach(({ persons }) =>
      persons.forEach((personDocument) => {
        const personIndex =
          this.connectedEntityIndexerService.createConnectedPersonIndex(
            personDocument,
          );
        personsMap.set(personIndex._id, personIndex);
      }),
    );
    return Array.from(personsMap.values());
  }
}
