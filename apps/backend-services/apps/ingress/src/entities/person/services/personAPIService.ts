import { Injectable, Logger } from '@nestjs/common'
import { EducationAPIInput, IdDocument, OldName, PersonAPIInput, UpdateSource } from 'defs'
import { LocationAPIService } from '../../location/services/locationAPIService'
import { CustomFieldsService } from '../../cusotmField/services/customFieldsService'
import { FileAPIService } from '../../file/services/fileAPIService'
import { EducationModel } from '../models/educationModel'
import { IdDocumentModel } from '../models/idDocumentModel'
import { OldNameModel } from '../models/oldNameModel'
import { PersonModel } from '../models/personModel'
import { PersonHistorySnapshotService } from './personHistorySnapshotService'
import { PersonPendingSnapshotService } from './personPendingSnapshotService'
import { PersonsService } from './personsService'
import { RelationshipsAPIService } from './relationshipsAPIService'

@Injectable()
export class PersonAPIService {
  private readonly logger = new Logger(PersonAPIService.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly fileService: FileAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly relationshipsService: RelationshipsAPIService,
    private readonly locationAPIService: LocationAPIService,
    private readonly personPendingSnapshotService: PersonPendingSnapshotService,
    private readonly personHistorySnapshotService: PersonHistorySnapshotService,
  ) {}

  create = async (personInfo: PersonAPIInput) => {
    try {
      const personModel = await this.createPersonDocument(personInfo)
      const personDocument = await this.personsService.create(personModel)

      if (personInfo.relationships?.length) {
        await this.relationshipsService.addRelationshipToConnectedPersons(
          personDocument,
          personInfo.relationships,
        )
      }
      return String(personDocument._id)
    } catch (error) {
      this.logger.error(error)
    }
  }

  update = async (personId: string, personInfo: PersonAPIInput) => {
    try {
      const model = await this.createPersonDocument(personInfo)
      const personDocument = await this.personsService.update(personId, model)

      if (personInfo.relationships.length) {
        await this.relationshipsService.addRelationshipToConnectedPersons(
          personDocument,
          personInfo.relationships,
        )
      }
      return true
    } catch (error) {
      this.logger.error(error)
    }
  }

  createPendingSnapshot = async (personId: string, data: PersonAPIInput, source: UpdateSource) => {
    try {
      const personModel = await this.createPersonDocument(data)
      return this.personPendingSnapshotService.create(personId, personModel, source)
    } catch (e) {
      this.logger.error(e)
    }
  }

  createHistorySnapshot = async (personId: string, source: UpdateSource) => {
    try {
      const personDocument = await this.personsService.find(personId, false)
      return this.personHistorySnapshotService.create(personId, personDocument, source)
    } catch (e) {
      this.logger.error(e)
    }
  }

  private createPersonDocument = async (personInfo: PersonAPIInput) => {
    const personModel = new PersonModel()
    personModel.firstName = personInfo.firstName
    personModel.lastName = personInfo.lastName
    personModel.cnp = personInfo.cnp
    personModel.birthdate = personInfo.birthdate
    personModel.oldNames = this.createOldNamesModels(personInfo.oldNames)
    personModel.homeAddress = await this.locationAPIService.getLocationModel(personInfo.homeAddress)
    personModel.birthPlace = await this.locationAPIService.getLocationModel(personInfo.birthPlace)
    personModel.education = this.createEducationModels(personInfo.education)

    personModel.contactDetails = personInfo.contactDetails.length
      ? this.customFieldsService.createCustomFieldsModels(personInfo.contactDetails)
      : []

    personModel.customFields = personInfo.customFields.length
      ? this.customFieldsService.createCustomFieldsModels(personInfo.customFields)
      : []

    personModel.documents = this.createIdDocumentsModels(personInfo.documents)

    personModel.files = personInfo.files.length
      ? await this.fileService.getUploadedFilesModels(personInfo.files)
      : []

    personModel.relationships = personInfo.relationships.length
      ? await this.relationshipsService.getRelationshipsModelsFromInputData(
          personInfo.relationships,
        )
      : []

    personModel.images = personInfo.images.length
      ? await this.fileService.getUploadedFilesModels(personInfo.images)
      : []

    return personModel
  }

  private createOldNamesModels = (oldNames: OldName[]) =>
    oldNames.map(({ name, changeReason }) => {
      const oldNameModel = new OldNameModel()
      oldNameModel.name = name
      oldNameModel.changeReason = changeReason
      return oldNameModel
    })

  private createEducationModels = (educationsInfo: EducationAPIInput[]) =>
    educationsInfo.map(({ startDate, endDate, type, specialization, school }) => {
      const educationModel = new EducationModel()
      educationModel.startDate = startDate
      educationModel.endDate = endDate
      educationModel.type = type
      educationModel.specialization = specialization
      educationModel.school = school
      return educationModel
    })

  private createIdDocumentsModels = (idDocuments: IdDocument[]) =>
    idDocuments.map((idDocument) => {
      const idDocumentModel = new IdDocumentModel()
      idDocumentModel.metadata = idDocument.metadata
      idDocumentModel.documentType = idDocument.documentType
      idDocumentModel.documentNumber = idDocument.documentNumber
      idDocumentModel.expirationDate = idDocument.expirationDate
      idDocumentModel.issueDate = idDocument.issueDate
      return idDocumentModel
    })
}