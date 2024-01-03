import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { PropertyModel } from '../models/propertyModel'
import { PropertyPendingSnapshotModel } from '../models/propertyPendingSnapshotModel'

@Injectable()
export class PropertyPendingSnapshotService {
  private readonly logger = new Logger(PropertyPendingSnapshotService.name)

  constructor(
    @InjectModel(PropertyPendingSnapshotModel.name)
    private readonly pendingSnapshotModel: Model<PropertyPendingSnapshotModel>,
  ) {}

  create = async (propertyId: string, PropertyModel: PropertyModel, source: UpdateSource) => {
    try {
      const snapshot = new PropertyPendingSnapshotModel()
      snapshot.entityId = propertyId
      snapshot.source = source
      snapshot.entityInfo = PropertyModel
      return this.pendingSnapshotModel.create(snapshot)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getSnapshot = async (snapshotId: string) => {
    try {
      return this.pendingSnapshotModel.findById(snapshotId)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getEntitySnapshots = async (entityId: string) => {
    try {
      return this.pendingSnapshotModel.find({ entityId })
    } catch (e) {
      this.logger.error(e)
    }
  }

  remove = async (snapshotId: string) => {
    try {
      return this.pendingSnapshotModel.findOneAndRemove({ _id: snapshotId })
    } catch (e) {
      this.logger.error(e)
    }
  }
}
