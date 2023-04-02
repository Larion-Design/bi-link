import { ProceedingModel } from 'src/proceeding/models/proceedingModel'
import { ProceedingPendingSnapshotModel } from 'src/proceeding/models/proceedingPendingSnapshotModel'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'

@Injectable()
export class ProceedingPendingSnapshotService {
  private readonly logger = new Logger(ProceedingPendingSnapshotService.name)

  constructor(
    @InjectModel(ProceedingPendingSnapshotModel.name)
    private readonly pendingSnapshotModel: Model<ProceedingPendingSnapshotModel>,
  ) {}

  create = async (proceedingId: string, proceedingModel: ProceedingModel, source: UpdateSource) => {
    try {
      const snapshot = new ProceedingPendingSnapshotModel()
      snapshot.entityId = proceedingId
      snapshot.source = source
      snapshot.entityInfo = proceedingModel
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
