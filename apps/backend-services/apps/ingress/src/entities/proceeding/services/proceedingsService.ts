import { Model, ProjectionFields, Query } from 'mongoose'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { ProceedingDocument, ProceedingModel } from '../models/proceedingModel'

@Injectable()
export class ProceedingsService {
  private readonly logger = new Logger(ProceedingsService.name)

  constructor(
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(ProceedingModel.name) private readonly proceedingModel: Model<ProceedingDocument>,
  ) {}

  create = async (proceedingModel: ProceedingModel) => {
    try {
      return this.proceedingModel.create(proceedingModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  update = async (proceedingId: string, proceedingModel: ProceedingModel) => {
    try {
      return this.proceedingModel.findByIdAndUpdate(proceedingId, proceedingModel)
    } catch (e) {
      this.logger.error(e)
    }
  }

  getProceeding = async (proceedingId: string, fetchLinkedEntities: boolean) => {
    try {
      const query = this.proceedingModel.findById(proceedingId)
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  getProceedings = async (proceedingsIds: string[], fetchLinkedEntities: boolean) => {
    try {
      const query = this.proceedingModel.find({ _id: proceedingsIds })
      return (fetchLinkedEntities ? this.getLinkedEntities(query) : query).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  findByFileNumber = async (fileNumber: string) => {
    try {
      const proceedingDocument = await this.proceedingModel
        .findOne({ 'fileNumber.value': fileNumber }, { _id: 1 })
        .exec()

      if (proceedingDocument) {
        return String(proceedingDocument._id)
      }
    } catch (error) {
      this.logger.error(error)
    }
  }

  async *getAllProceedings(fields: ProjectionFields<ProceedingDocument> = { _id: 1 }) {
    for await (const proceedingModel of this.proceedingModel.find({}, fields)) {
      yield proceedingModel
    }
  }

  private getLinkedEntities = (query: Query<any, ProceedingDocument>) =>
    query
      .populate({ path: 'entitiesInvolved.person', model: this.personModel })
      .populate({ path: 'entitiesInvolved.company', model: this.companyModel })
}
