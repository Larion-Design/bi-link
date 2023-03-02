import { Injectable, Logger } from '@nestjs/common'
import { PropertyDocument } from '@app/models/models/property/propertyModel'
import { PropertiesService } from '@app/models/services/propertiesService'
import { GraphService } from '@app/graph-module/graphService'
import { PropertyGraphNode } from '@app/definitions/graph/property'
import { PropertyOwnerGraphRelationship } from '@app/definitions/graph/propertyOwner'
import { format } from 'date-fns'
import { EntityLabel, RelationshipLabel } from 'defs'
import { LocationGraphService } from './locationGraphService'

@Injectable()
export class PropertyGraphService {
  private readonly logger = new Logger(PropertyGraphService.name)

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly graphService: GraphService,
    private readonly locationGraphservice: LocationGraphService,
  ) {}

  upsertPropertyNode = async (propertyId: string) => {
    try {
      const propertyDocument = await this.propertiesService.getProperty(propertyId, true)

      const propertyNode: PropertyGraphNode = {
        _id: propertyId,
        name: propertyDocument.name,
        type: propertyDocument.type,
      }

      if (propertyDocument.vehicleInfo) {
        propertyNode.vin = propertyDocument.vehicleInfo.vin
        propertyNode.plateNumbers = Array.from(
          new Set<string>(
            [].concat(
              ...propertyDocument.owners.map(
                ({ vehicleOwnerInfo: { plateNumbers } }) => plateNumbers,
              ),
            ),
          ),
        )
      }

      await this.graphService.upsertEntity<PropertyGraphNode>(propertyNode, EntityLabel.PROPERTY)
      await this.upsertPropertyOwners(propertyDocument)
      await this.upsertPropertyLocation(propertyDocument)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertPropertyOwners = async (propertyDocument: PropertyDocument) => {
    try {
      if (propertyDocument.owners.length) {
        const map = new Map<string, PropertyOwnerGraphRelationship>()

        propertyDocument.owners.forEach(
          ({ startDate, endDate, company, person, _confirmed, vehicleOwnerInfo }) => {
            const owner: PropertyOwnerGraphRelationship = { _confirmed }

            if (startDate) {
              owner.startDate = format(new Date(startDate), 'yyyy-MM-dd')
            }
            if (endDate) {
              owner.endDate = format(new Date(endDate), 'yyyy-MM-dd')
            }
            if (vehicleOwnerInfo) {
              owner.plateNumbers = vehicleOwnerInfo.plateNumbers
            }
            map.set(String(person?._id ?? company?._id), owner)
          },
        )

        await this.graphService.replaceRelationships(
          String(propertyDocument._id),
          map,
          RelationshipLabel.OWNER,
        )
      }
    } catch (e) {
      this.logger.error(e)
    }
  }

  private upsertPropertyLocation = async ({ _id, realEstateInfo }: PropertyDocument) => {
    try {
      const locationDocument = realEstateInfo?.location

      if (locationDocument) {
        await this.locationGraphservice.upsertLocationNode(locationDocument)
        await this.locationGraphservice.upsertLocationRelationship(
          locationDocument.locationId,
          String(_id),
          RelationshipLabel.LOCATED_AT,
        )
      }
    } catch (e) {
      this.logger.error(e)
    }
  }
}
