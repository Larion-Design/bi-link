import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { ReportHistorySnapshotModel } from '../models/reportHistorySnapshotModel'
import { ReportModel } from '../models/reportModel'

@Injectable()
export class ReportHistorySnapshotService {
  private readonly logger = new Logger(ReportHistorySnapshotService.name)

  constructor(
    @InjectModel(ReportHistorySnapshotModel.name)
    private readonly historySnapshotModel: Model<ReportHistorySnapshotModel>,
  ) {}

  create = async (reportId: string, reportModel: ReportModel, source: UpdateSource) => {
    try {
      const snapshot = new ReportHistorySnapshotModel()
      snapshot.entityId = reportId
      snapshot.source = source
      snapshot.entityInfo = reportModel
      return this.historySnapshotModel.create(snapshot)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getSnapshot = async (snapshotId: string) => {
    try {
      return this.historySnapshotModel.findById(snapshotId)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getEntitySnapshots = async (entityId: string) => {
    try {
      return this.historySnapshotModel.find({ entityId })
    } catch (e) {
      this.logger.error(e)
    }
  }

  remove = async (snapshotId: string) => {
    try {
      return this.historySnapshotModel.findOneAndRemove({ _id: snapshotId })
    } catch (e) {
      this.logger.error(e)
    }
  }
}
