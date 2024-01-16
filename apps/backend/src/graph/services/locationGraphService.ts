import { Injectable } from '@nestjs/common'
import { GraphRelationship, Location, RelationshipMetadata } from 'defs'
import { formatAddress } from 'tools'
import { LocationGraphNode } from '@modules/definitions'
import { GraphService } from './graphService'

@Injectable()
export class LocationGraphService {
  constructor(private readonly graphService: GraphService) {}

  async upsertLocationNodes(locationDocuments: Location[]) {
    await this.graphService.upsertEntities<LocationGraphNode>(
      locationDocuments.map(this.createLocationData),
      'LOCATION',
    )
  }

  async upsertLocationNode(locationDocument: Location) {
    await this.graphService.upsertEntity<LocationGraphNode>(
      this.createLocationData(locationDocument),
      'LOCATION',
    )
  }

  async upsertLocationRelationship(
    locationId: string,
    entityId: string,
    relationshipType: GraphRelationship,
  ) {
    const map = new Map<string, RelationshipMetadata>()
    map.set(locationId, { _confirmed: true, _trustworthiness: 0 })
    return this.graphService.replaceRelationships(entityId, map, relationshipType)
  }

  async upsertLocationsRelationships(
    entityId: string,
    locationsIds: string[],
    relationshipType: GraphRelationship,
  ) {
    const map = new Map<string, RelationshipMetadata>()
    locationsIds.forEach((locationId) =>
      map.set(locationId, { _confirmed: true, _trustworthiness: 0 }),
    )
    return this.graphService.replaceRelationships(entityId, map, relationshipType)
  }

  private createLocationData(locationDocument: Location): LocationGraphNode {
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
