import { ReportModel } from 'src/report/models/reportModel'
import { ReportPendingSnapshotModel } from 'src/report/models/reportPendingSnapshotModel'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'

@Injectable()
export class ReportPendingSnapshotService {
  private readonly logger = new Logger(ReportPendingSnapshotService.name)

  constructor(
    @InjectModel(ReportPendingSnapshotModel.name)
    private readonly pendingSnapshotModel: Model<ReportPendingSnapshotModel>,
  ) {}

  create = async (reportId: string, reportModel: ReportModel, source: UpdateSource) => {
    try {
      const snapshot = new ReportPendingSnapshotModel()
      snapshot.entityId = reportId
      snapshot.source = source
      snapshot.entityInfo = reportModel
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
