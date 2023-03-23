import { Injectable, Logger } from '@nestjs/common'
import { EntityLabel, RelationshipLabel, RelationshipMetadata } from 'defs'
import { formatAddress } from 'tools'
import { LocationDocument } from '@app/models/models/locationModel'
import { LocationsService } from '@app/models/services/locationsService'
import { GraphService } from '@app/graph-module/graphService'
import { LocationGraphNode } from '@app/definitions/graph/location'

@Injectable()
export class LocationGraphService {
  private readonly logger = new Logger(LocationGraphService.name)

  constructor(
    private readonly locationsService: LocationsService,
    private readonly graphService: GraphService,
  ) {}

  upsertLocationNodes = async (locationDocuments: LocationDocument[]) => {
    try {
      await this.graphService.upsertEntities<LocationGraphNode>(
        locationDocuments.map(this.createLocationData),
        EntityLabel.LOCATION,
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertLocationNode = async (locationDocument: LocationDocument) => {
    try {
      await this.graphService.upsertEntity<LocationGraphNode>(
        this.createLocationData(locationDocument),
        EntityLabel.LOCATION,
      )
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertLocationRelationship = async (
    locationId: string,
    entityId: string,
    relationshipType: RelationshipLabel,
  ) => {
    try {
      const map = new Map<string, RelationshipMetadata>()
      map.set(locationId, { _confirmed: true })
      return this.graphService.replaceRelationships(entityId, map, relationshipType)
    } catch (e) {
      this.logger.error(e)
    }
  }

  upsertLocationsRelationships = async (
    entityId: string,
    locationsIds: string[],
    relationshipType: RelationshipLabel,
  ) => {
    try {
      const map = new Map<string, RelationshipMetadata>()
      locationsIds.forEach((locationId) => map.set(locationId, { _confirmed: true }))
      return this.graphService.replaceRelationships(entityId, map, relationshipType)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private createLocationData = (locationDocument: LocationDocument): LocationGraphNode => {
    const locationData: LocationGraphNode = {
      _id: locationDocument.locationId,
      address: formatAddress(locationDocument),
    }

    const {
      coordinates: { lat, long },
    } = locationDocument

    if (lat !== 0 && long !== 0) {
      locationData.lat = lat
      locationData.long = long
    }
    return locationData
  }
}
