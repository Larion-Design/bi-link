import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { EventModel } from '../models/eventModel'
import { EventPendingSnapshotModel } from '../models/eventPendingSnapshotModel'

@Injectable()
export class EventPendingSnapshotService {
  private readonly logger = new Logger(EventPendingSnapshotService.name)

  constructor(
    @InjectModel(EventPendingSnapshotModel.name)
    private readonly pendingSnapshotModel: Model<EventPendingSnapshotModel>,
  ) {}

  create = async (eventId: string, eventModel: EventModel, source: UpdateSource) => {
    try {
      const snapshot = new EventPendingSnapshotModel()
      snapshot.entityId = eventId
      snapshot.source = source
      snapshot.entityInfo = eventModel
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
