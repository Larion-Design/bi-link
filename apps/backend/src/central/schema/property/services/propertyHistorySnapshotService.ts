import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { PropertyHistorySnapshotModel } from '../models/propertyHistorySnapshotModel'
import { PropertyModel } from '../models/propertyModel'

@Injectable()
export class PropertyHistorySnapshotService {
  private readonly logger = new Logger(PropertyHistorySnapshotService.name)

  constructor(
    @InjectModel(PropertyHistorySnapshotModel.name)
    private readonly HistorySnapshotModel: Model<PropertyHistorySnapshotModel>,
  ) {}

  create = async (propertyId: string, PropertyModel: PropertyModel, source: UpdateSource) => {
    try {
      const snapshot = new PropertyHistorySnapshotModel()
      snapshot.entityId = propertyId
      snapshot.source = source
      snapshot.entityInfo = PropertyModel
      return this.HistorySnapshotModel.create(snapshot)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getSnapshot = async (snapshotId: string) => {
    try {
      return this.HistorySnapshotModel.findById(snapshotId)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getEntitySnapshots = async (entityId: string) => {
    try {
      return this.HistorySnapshotModel.find({ entityId })
    } catch (e) {
      this.logger.error(e)
    }
  }

  remove = async (snapshotId: string) => {
    try {
      return this.HistorySnapshotModel.findOneAndRemove({ _id: snapshotId })
    } catch (e) {
      this.logger.error(e)
    }
  }
}
