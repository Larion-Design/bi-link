import { Injectable, Logger } from '@nestjs/common'
import { GraphService } from '@app/graph-module/graphService'
import { EntityLabel, RelationshipLabel } from '@app/graph-module/types'
import { PropertiesService } from '@app/entities/services/propertiesService'
import { PropertyGraphNode } from '@app/graph-module/types/property'
import { PropertyDocument } from '@app/entities/models/propertyModel'
import { PropertyOwnerGraphRelationship } from '@app/graph-module/types/propertyOwner'
import { format } from 'date-fns'

@Injectable()
export class PropertyGraphService {
  private readonly logger = new Logger(PropertyGraphService.name)

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly graphService: GraphService,
  ) {}

  upsertPropertyNode = async (propertyId: string) => {
    try {
      const propertyDocument = await this.propertiesService.getProperty(propertyId)

      const propertyNode: PropertyGraphNode = {
        _id: propertyId,
        name: propertyDocument.name,
        type: propertyDocument.type,
      }

      if (propertyDocument.vehicleInfo) {
        propertyNode.vin = propertyDocument.vehicleInfo.vin
        propertyNode.plateNumbers = propertyDocument.owners.map(
          ({ vehicleOwnerInfo: { registrationNumber } }) => registrationNumber,
        )
      }

      await this.graphService.upsertEntity<PropertyGraphNode>(propertyNode, EntityLabel.PROPERTY)
      await this.upsertPropertyOwners(propertyDocument)
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
              owner.plateNumber = vehicleOwnerInfo.registrationNumber
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
}
