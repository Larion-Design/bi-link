import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CompanyDocument, CompanyModel } from '@app/entities/models/companyModel'
import { IncidentDocument, IncidentModel } from '@app/entities/models/incidentModel'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { PropertyDocument, PropertyModel } from '@app/entities/models/propertyModel'
import { Injectable } from '@nestjs/common'
import { DataRefModel } from '@app/entities/models/reports/refs/dataRefModel'
import { DataRefInput } from '../dto/refs/dataRefInput'

@Injectable()
export class ReportRefsAPIService {
  constructor(
    @InjectModel(CompanyModel.name) private readonly companyModel: Model<CompanyDocument>,
    @InjectModel(PersonModel.name) private readonly personModel: Model<PersonDocument>,
    @InjectModel(PropertyModel.name) private readonly propertyModel: Model<PropertyDocument>,
    @InjectModel(IncidentModel.name) private readonly incidentModel: Model<IncidentDocument>,
  ) {}

  createRefsModels = async (dataRefs: DataRefInput[]): Promise<DataRefModel[]> => [
    ...(await this.createRefsForPersons(dataRefs)),
    ...(await this.createRefsForCompanies(dataRefs)),
    ...(await this.createRefsForProperties(dataRefs)),
    ...(await this.createRefsForIncidents(dataRefs)),
  ]

  private createRefsForPersons = async (dataRefs: DataRefInput[]): Promise<DataRefModel[]> => {
    const personsDataRefs = dataRefs.filter(({ person }) => !!person?._id)
    const personsIds = personsDataRefs.map(({ person: { _id } }) => _id)

    if (personsIds.length) {
      const personsDocuments = await this.personModel.find({ _id: personsIds })
      return personsDocuments.map((personDocument) => {
        const personDataRef = personsDataRefs.find(
          ({ person: { _id } }) => _id === String(personDocument._id),
        )

        if (personDataRef) {
          const ref = this.createRefModel(personDataRef)
          ref.person = personDocument
          return ref
        }
        return null
      })
    }
  }

  private createRefsForCompanies = async (dataRefs: DataRefInput[]): Promise<DataRefModel[]> => {
    const companiesDataRefs = dataRefs.filter(({ company }) => !!company?._id)
    const companiesIds = companiesDataRefs.map(({ company: { _id } }) => _id)

    if (companiesIds.length) {
      const companiesDocuments = await this.companyModel.find({ _id: companiesIds })
      return companiesDocuments.map((companyDocument) => {
        const companyDataRef = companiesDataRefs.find(
          ({ company: { _id } }) => _id === String(companyDocument._id),
        )

        if (companyDataRef) {
          const ref = this.createRefModel(companyDataRef)
          ref.company = companyDocument
          return ref
        }
        return null
      })
    }
  }

  private createRefsForProperties = async (dataRefs: DataRefInput[]): Promise<DataRefModel[]> => {
    const propertiesDataRefs = dataRefs.filter(({ property }) => !!property?._id)
    const propertiesIds = propertiesDataRefs.map(({ property: { _id } }) => _id)

    if (propertiesIds.length) {
      const propertiesDocuments = await this.propertyModel.find({ _id: propertiesIds })
      return propertiesDocuments.map((propertyDocument) => {
        const propertyDataRef = propertiesDataRefs.find(
          ({ company: { _id } }) => _id === String(propertyDocument._id),
        )

        if (propertyDataRef) {
          const ref = this.createRefModel(propertyDataRef)
          ref.property = propertyDocument
          return ref
        }
        return null
      })
    }
  }

  private createRefsForIncidents = async (dataRefs: DataRefInput[]): Promise<DataRefModel[]> => {
    const incidentsDataRefs = dataRefs.filter(({ incident }) => !!incident?._id)
    const incidentsIds = incidentsDataRefs.map(({ incident: { _id } }) => _id)

    if (incidentsIds.length) {
      const incidentsDocuments = await this.incidentModel.find({ _id: incidentsIds })
      return incidentsDocuments.map((incidentDocument) => {
        const incidentDataRef = incidentsDataRefs.find(
          ({ company: { _id } }) => _id === String(incidentDocument._id),
        )

        if (incidentDataRef) {
          const ref = this.createRefModel(incidentDataRef)
          ref.incident = incidentDocument
          return ref
        }
        return null
      })
    }
  }

  private createRefModel = (dataRef: DataRefInput) => {
    const ref = new DataRefModel()
    ref._id = dataRef._id
    ref.field = dataRef.field
    ref.targetId = dataRef.targetId
    ref.path = dataRef.path
    return ref
  }
}
