import {
  ConnectedCompanyIndex,
  ConnectedPersonIndex,
  PropertyIndex,
} from '@modules/definitions';
import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Property, PropertyOwner } from 'defs';
import { INDEX_PROPERTIES } from '../../constants';
import { ConnectedEntityIndexerService } from './connectedEntityIndexerService';
import { LocationIndexerService } from './locationIndexerService';

@Injectable()
export class PropertiesIndexerService {
  private readonly index = INDEX_PROPERTIES;
  private readonly logger = new Logger(PropertiesIndexerService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly connectedEntityIndexerService: ConnectedEntityIndexerService,
    private readonly locationIndexerService: LocationIndexerService,
  ) {}

  async indexProperty(propertyId: string, propertyModel: Property) {
    try {
      const { _id } = await this.elasticsearchService.index<PropertyIndex>({
        index: this.index,
        id: propertyId,
        document: this.createIndexData(propertyModel),
        refresh: true,
      });

      this.logger.debug(`Added ${propertyId} to index ${this.index}`);
      return _id === propertyId;
    } catch (error) {
      this.logger.error(error);
    }
  }

  private createIndexData(propertyModel: Property): PropertyIndex {
    const propertyIndex: PropertyIndex = {
      name: propertyModel.name,
      type: propertyModel.type,
      personsOwners: this.createPersonOwnersIndex(propertyModel.owners),
      companiesOwners: this.createCompanyOwnersIndex(propertyModel.owners),
      customFields: propertyModel.customFields,
      files: [],
    };

    if (propertyModel.vehicleInfo) {
      const plateNumbers = new Set<string>();

      propertyModel.owners.forEach(
        ({ vehicleOwnerInfo }) =>
          vehicleOwnerInfo?.plateNumbers.forEach((plateNumber) =>
            plateNumbers.add(plateNumber),
          ),
      );

      propertyIndex.vehicleInfo = {
        vin: propertyModel.vehicleInfo.vin.value,
        maker: propertyModel.vehicleInfo.maker.value,
        model: propertyModel.vehicleInfo.model.value,
        color: propertyModel.vehicleInfo.color.value,
        plateNumbers: Array.from(plateNumbers),
      };
    }

    if (propertyModel.realEstateInfo) {
      propertyIndex.realEstateInfo = {
        surface: propertyModel.realEstateInfo.surface.value,
        townArea: propertyModel.realEstateInfo.townArea.value,
        location: propertyModel.realEstateInfo.location
          ? this.locationIndexerService.createLocationIndexData(
              propertyModel.realEstateInfo.location,
            )
          : undefined,
      };
    }
    return propertyIndex;
  }

  private createPersonOwnersIndex = (
    owners: PropertyOwner[],
  ): ConnectedPersonIndex[] =>
    owners
      .filter(({ person }) => !!person)
      .map(({ person, customFields }) => ({
        ...this.connectedEntityIndexerService.createConnectedPersonIndex(
          person!,
        ),
        customFields,
      }));

  private createCompanyOwnersIndex = (
    owners: PropertyOwner[],
  ): ConnectedCompanyIndex[] =>
    owners
      .filter(({ company }) => !!company)
      .map(({ company, customFields }) => ({
        ...this.connectedEntityIndexerService.createConnectedCompanyIndex(
          company!,
        ),
        customFields,
      }));
}
