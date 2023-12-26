import { Injectable, Logger } from '@nestjs/common';
import { GraphRelationship, Location, RelationshipMetadata } from 'defs';
import { formatAddress } from 'tools';
import { LocationGraphNode } from '@modules/definitions';
import { GraphService } from './graphService';

@Injectable()
export class LocationGraphService {
  private readonly logger = new Logger(LocationGraphService.name);

  constructor(private readonly graphService: GraphService) {}

  upsertLocationNodes = async (locationDocuments: Location[]) => {
    try {
      await this.graphService.upsertEntities<LocationGraphNode>(
        locationDocuments.map(this.createLocationData),
        'LOCATION',
      );
    } catch (e) {
      this.logger.error(e);
    }
  };

  upsertLocationNode = async (locationDocument: Location) => {
    try {
      await this.graphService.upsertEntity<LocationGraphNode>(
        this.createLocationData(locationDocument),
        'LOCATION',
      );
    } catch (e) {
      this.logger.error(e);
    }
  };

  upsertLocationRelationship = async (
    locationId: string,
    entityId: string,
    relationshipType: GraphRelationship,
  ) => {
    try {
      const map = new Map<string, RelationshipMetadata>();
      map.set(locationId, { _confirmed: true, _trustworthiness: 0 });
      return this.graphService.replaceRelationships(
        entityId,
        map,
        relationshipType,
      );
    } catch (e) {
      this.logger.error(e);
    }
  };

  upsertLocationsRelationships = async (
    entityId: string,
    locationsIds: string[],
    relationshipType: GraphRelationship,
  ) => {
    try {
      const map = new Map<string, RelationshipMetadata>();
      locationsIds.forEach((locationId) =>
        map.set(locationId, { _confirmed: true, _trustworthiness: 0 }),
      );
      return this.graphService.replaceRelationships(
        entityId,
        map,
        relationshipType,
      );
    } catch (e) {
      this.logger.error(e);
    }
  };

  private createLocationData = (
    locationDocument: Location,
  ): LocationGraphNode => {
    const locationData: LocationGraphNode = {
      _id: locationDocument.locationId,
      address: formatAddress(locationDocument),
    };

    const {
      coordinates: { lat, long },
    } = locationDocument;

    if (lat !== 0 && long !== 0) {
      locationData.lat = lat;
      locationData.long = long;
    }
    return locationData;
  };
}
