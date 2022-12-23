import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ProjectionFields } from 'mongoose'
import { FileDocument, FileModel } from '@app/entities/models/fileModel'
import { IncidentDocument, IncidentModel } from '@app/entities/models/incidentModel'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { PartyDocument, PartyModel } from '@app/entities/models/partyModel'
import { CompanyDocument, CompanyModel } from '@app/entities/models/companyModel'
import { PropertyDocument, PropertyModel } from '@app/entities/models/propertyModel'

@Injectable()
export class IncidentsService {
  private readonly logger = new Logger(IncidentsService.name)
  constructor(
    @InjectModel(IncidentModel.name) private readonly incidentModel: Model<IncidentDocument>,
    @InjectModel(PartyModel.name) private readonly partyModel: Model<PartyDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(PropertyModel.name) private readonly propertyModel: Model<PropertyDocument>,
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(FileModel.name) private readonly fileModel: Model<FileDocument>,
  ) {}

  create = async (incidentModel: IncidentModel) => this.incidentModel.create(incidentModel)

  update = async (incidentId: string, incidentModel: IncidentModel) =>
    this.incidentModel.findByIdAndUpdate(incidentId, incidentModel)

  async *getAllIncidents(fields: ProjectionFields<IncidentDocument> = { _id: 1 }) {
    for await (const incidentDocument of this.incidentModel.find({}, fields)) {
      yield incidentDocument
    }
  }

  getIncident = async (incidentId: string) => {
    try {
      return this.incidentModel
        .findById(incidentId)
        .populate({ path: 'files', model: this.fileModel })
        .populate({ path: 'parties', model: this.partyModel })
        .populate({ path: 'parties.persons', model: this.personModel })
        .populate({ path: 'parties.properties', model: this.propertyModel })
        .populate({ path: 'parties.companies', model: this.companyModel })
        .exec()
    } catch (e) {
      this.logger.error(e)
    }
  }

  getIncidents = async (incidentsIds: string[]) => {
    try {
      return this.incidentModel.find({ _id: incidentsIds }, { _id: 1, location: 1, date: 1 }).exec()
    } catch (e) {
      this.logger.error(e)
    }
  }
}
