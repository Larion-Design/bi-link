import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { CompanyHistorySnapshotModel } from '@app/models/company/models/companyHistorySnapshotModel'
import { CompanyModel } from '@app/models/company/models/companyModel'

@Injectable()
export class CompanyHistorySnapshotService {
  private readonly logger = new Logger(CompanyHistorySnapshotService.name)

  constructor(
    @InjectModel(CompanyHistorySnapshotModel.name)
    private readonly historySnapshotModel: Model<CompanyHistorySnapshotModel>,
  ) {}

  create = async (companyId: string, companyModel: CompanyModel, source: UpdateSource) => {
    try {
      const snapshot = new CompanyHistorySnapshotModel()
      snapshot.entityId = companyId
      snapshot.source = source
      snapshot.entityInfo = companyModel
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
}
