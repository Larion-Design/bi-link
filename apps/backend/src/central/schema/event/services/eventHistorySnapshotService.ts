import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { EventHistorySnapshotModel } from '../models/eventHistorySnapshotModel'
import { EventModel } from '../models/eventModel'

@Injectable()
export class EventHistorySnapshotService {
  private readonly logger = new Logger(EventHistorySnapshotService.name)

  constructor(
    @InjectModel(EventHistorySnapshotModel.name)
    private readonly HistorySnapshotModel: Model<EventHistorySnapshotModel>,
  ) {}

  create = async (eventId: string, eventModel: EventModel, source: UpdateSource) => {
    try {
      const snapshot = new EventHistorySnapshotModel()
      snapshot.entityId = eventId
      snapshot.source = source
      snapshot.entityInfo = eventModel
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
