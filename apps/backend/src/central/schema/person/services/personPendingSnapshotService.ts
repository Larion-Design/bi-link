import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UpdateSource } from 'defs'
import { PersonModel } from '../models/personModel'
import { PersonPendingSnapshotModel } from '../models/personPendingSnapshotModel'

@Injectable()
export class PersonPendingSnapshotService {
  private readonly logger = new Logger(PersonPendingSnapshotService.name)

  constructor(
    @InjectModel(PersonPendingSnapshotModel.name)
    private readonly pendingSnapshotModel: Model<PersonPendingSnapshotModel>,
  ) {}

  create = async (personId: string, personModel: PersonModel, source: UpdateSource) => {
    try {
      const snapshot = new PersonPendingSnapshotModel()
      snapshot.entityId = personId
      snapshot.source = source
      snapshot.entityInfo = personModel
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
