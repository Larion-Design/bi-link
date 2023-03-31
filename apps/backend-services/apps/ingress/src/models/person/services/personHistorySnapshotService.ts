import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { PersonHistorySnapshotModel } from 'src/person/models/personHistorySnapshotModel'
import { PersonModel } from 'src/person/models/personModel'

@Injectable()
export class PersonHistorySnapshotService {
  private readonly logger = new Logger(PersonHistorySnapshotService.name)

  constructor(
    @InjectModel(PersonHistorySnapshotModel.name)
    private readonly historySnapshotModel: Model<PersonHistorySnapshotModel>,
  ) {}

  create = async (personId: string, personModel: PersonModel, source: UpdateSource) => {
    try {
      const snapshot = new PersonHistorySnapshotModel()
      snapshot.entityId = personId
      snapshot.source = source
      snapshot.entityInfo = personModel
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
