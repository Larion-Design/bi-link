import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { ProceedingHistorySnapshotModel } from '../models/proceedingHistorySnapshotModel'
import { ProceedingModel } from '../models/proceedingModel'

@Injectable()
export class ProceedingHistorySnapshotService {
  private readonly logger = new Logger(ProceedingHistorySnapshotService.name)

  constructor(
    @InjectModel(ProceedingHistorySnapshotModel.name)
    private readonly HistorySnapshotModel: Model<ProceedingHistorySnapshotModel>,
  ) {}

  create = async (proceedingId: string, proceedingModel: ProceedingModel, source: UpdateSource) => {
    try {
      const snapshot = new ProceedingHistorySnapshotModel()
      snapshot.entityId = proceedingId
      snapshot.source = source
      snapshot.entityInfo = proceedingModel
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
