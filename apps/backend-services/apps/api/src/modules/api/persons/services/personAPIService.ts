import { EducationModel } from '@app/models/person/models/educationModel'
import { IdDocumentModel } from '@app/models/person/models/idDocumentModel'
import { OldNameModel } from '@app/models/person/models/oldNameModel'
import { PersonModel } from '@app/models/person/models/personModel'
import { PersonsService } from '@app/models/person/services/personsService'
import { Injectable, Logger } from '@nestjs/common'
import { IdDocument } from 'defs'
import { LocationAPIService } from '../../geolocation/services/locationAPIService'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { FileAPIService } from '../../files/services/fileAPIService'
import { EducationInput } from '../dto/educationInput'
import { OldNameInput } from '../dto/oldNameInput'
import { PersonInput } from '../dto/personInput'
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
  ) {}

  create = async (personInfo: PersonInput) => {
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

  update = async (personId: string, personInfo: PersonInput) => {
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

  private createPersonDocument = async (personInfo: PersonInput) => {
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

  private createOldNamesModels = (oldNames: OldNameInput[]) =>
    oldNames.map(({ name, changeReason }) => {
      const oldNameModel = new OldNameModel()
      oldNameModel.name = name
      oldNameModel.changeReason = changeReason
      return oldNameModel
    })

  private createEducationModels = (educationsInfo: EducationInput[]) =>
    educationsInfo.map(({ startDate, endDate, type, specialization, school, customFields }) => {
      const educationModel = new EducationModel()
      educationModel.startDate = startDate
      educationModel.endDate = endDate
      educationModel.type = type
      educationModel.specialization = specialization
      educationModel.school = school
      educationModel.customFields = this.customFieldsService.createCustomFieldsModels(customFields)
      return educationModel
    })

  private createIdDocumentsModels = (idDocuments: IdDocument[]) =>
    idDocuments.map((idDocument) => new IdDocumentModel(idDocument))
}
