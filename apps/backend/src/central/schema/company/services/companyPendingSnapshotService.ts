import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { CompanyModel } from '../models/companyModel'
import {
  CompanyPendingSnapshotDocument,
  CompanyPendingSnapshotModel,
} from '../models/companyPendingSnapshotModel'

@Injectable()
export class CompanyPendingSnapshotService {
  private readonly logger = new Logger(CompanyPendingSnapshotService.name)

  constructor(
    @InjectModel(CompanyPendingSnapshotModel.name)
    private readonly pendingSnapshotModel: Model<CompanyPendingSnapshotDocument>,
  ) {}

  create = async (companyId: string, companyModel: CompanyModel, source: UpdateSource) => {
    try {
      const snapshot = new CompanyPendingSnapshotModel()
      snapshot.entityId = companyId
      snapshot.source = source
      snapshot.entityInfo = companyModel
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
