import { Injectable, Logger } from '@nestjs/common'
import { EntityEventDispatcherService } from '@modules/entity-events'
import { EducationAPIInput, IdDocument, OldName, PersonAPIInput, UpdateSource } from 'defs'
import { LocationAPIService } from '../../location/services/locationAPIService'
import { CustomFieldsService } from '../../customField/services/customFieldsService'
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
    private readonly entityEventDispatcherService: EntityEventDispatcherService,
    private readonly personsService: PersonsService,
    private readonly fileService: FileAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly relationshipsService: RelationshipsAPIService,
    private readonly locationAPIService: LocationAPIService,
    private readonly personPendingSnapshotService: PersonPendingSnapshotService,
    private readonly personHistorySnapshotService: PersonHistorySnapshotService,
  ) {}

  async create(personInfo: PersonAPIInput) {
    const personModel = await this.createPersonDocument(personInfo)
    const personDocument = await this.personsService.create(personModel)

    if (personDocument) {
      if (personInfo.relationships.length) {
        await this.relationshipsService.addRelationshipToConnectedPersons(
          personDocument,
          personInfo.relationships,
        )
      }

      await this.entityEventDispatcherService.personCreated(personDocument)
      return String(personDocument._id)
    }
  }

  async update(personId: string, personInfo: PersonAPIInput) {
    try {
      const model = await this.createPersonDocument(personInfo)
      const personDocument = await this.personsService.update(personId, model)

      if (personDocument && personInfo.relationships.length) {
        await this.relationshipsService.addRelationshipToConnectedPersons(
          personDocument,
          personInfo.relationships,
        )

        await this.entityEventDispatcherService.personUpdated(personDocument)
        return true
      }
    } catch (error) {
      this.logger.error(error)
    }
    return false
  }

  createPendingSnapshot = async (personId: string, data: PersonAPIInput, source: UpdateSource) => {
    const personModel = await this.createPersonDocument(data)
    const snapshotModel = await this.personPendingSnapshotService.create(
      personId,
      personModel,
      source,
    )

    if (snapshotModel) {
      return String(snapshotModel._id)
    }
  }

  removePendingSnapshot = async (snapshotId: string) =>
    this.personPendingSnapshotService.remove(snapshotId)

  createHistorySnapshot = async (personId: string, source: UpdateSource) => {
    const personDocument = await this.personsService.find(personId, false)

    if (personDocument) {
      return this.personHistorySnapshotService.create(personId, personDocument, source)
    }
  }

  applyPendingSnapshot = async (snapshotId: string, source: UpdateSource) => {
    const snapshotDocument = await this.personPendingSnapshotService.getSnapshot(snapshotId)

    if (snapshotDocument) {
      const personId = String(snapshotDocument.entityId)
      await this.createHistorySnapshot(personId, source)
      await this.personsService.update(personId, snapshotDocument.entityInfo)
      await this.removePendingSnapshot(snapshotId)
      return true
    }
    return false
  }

  private async createPersonDocument(personInfo: PersonAPIInput) {
    const personModel = new PersonModel()
    personModel.metadata = personInfo.metadata
    personModel.firstName = personInfo.firstName
    personModel.lastName = personInfo.lastName
    personModel.cnp = personInfo.cnp
    personModel.birthdate = personInfo.birthdate
    personModel.oldNames = this.createOldNamesModels(personInfo.oldNames)
    personModel.homeAddress = personInfo.homeAddress
      ? (await this.locationAPIService.getLocationModel(personInfo.homeAddress)) ?? null
      : null
    personModel.birthPlace = personInfo.birthPlace
      ? (await this.locationAPIService.getLocationModel(personInfo.birthPlace)) ?? null
      : null
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
    educationsInfo.map(({ startDate, endDate, type, specialization, school, metadata }) => {
      const educationModel = new EducationModel()
      educationModel.metadata = metadata
      educationModel.startDate = startDate ?? null
      educationModel.endDate = endDate ?? null
      educationModel.type = type
      educationModel.specialization = specialization
      educationModel.school = school
      return educationModel
    })

  private createIdDocumentsModels = (idDocuments: IdDocument[]) =>
    idDocuments.map(
      ({ metadata, documentNumber, documentType, expirationDate, issueDate, status }) => {
        const idDocumentModel = new IdDocumentModel()
        idDocumentModel.metadata = metadata
        idDocumentModel.documentType = documentType
        idDocumentModel.documentNumber = documentNumber
        idDocumentModel.status = status
        idDocumentModel.expirationDate = expirationDate ?? null
        idDocumentModel.issueDate = issueDate ?? null
        return idDocumentModel
      },
    )
}
