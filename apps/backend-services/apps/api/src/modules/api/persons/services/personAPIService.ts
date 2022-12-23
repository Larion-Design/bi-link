import { Injectable, Logger } from '@nestjs/common'
import { PersonModel } from '@app/entities/models/personModel'
import { FileAPIService } from '../../files/services/fileAPIService'
import { CustomFieldsService } from '../../customFields/services/customFieldsService'
import { RelationshipsService } from './relationshipsService'
import { IdDocumentsService } from './idDocumentsService'
import { PersonsService } from '@app/entities/services/personsService'
import { PersonInput } from '../dto/personInput'

@Injectable()
export class PersonAPIService {
  private readonly logger = new Logger(PersonAPIService.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly fileService: FileAPIService,
    private readonly customFieldsService: CustomFieldsService,
    private readonly relationshipsService: RelationshipsService,
    private readonly idDocumentsService: IdDocumentsService,
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

      if (personInfo.relationships?.length) {
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
    personModel.oldName = personInfo.oldName
    personModel.homeAddress = personInfo.homeAddress

    if (personInfo.contactDetails?.length) {
      personModel.contactDetails = this.customFieldsService.getCustomFieldsDocumentsForInputData(
        personInfo.contactDetails,
      )
    }

    if (personInfo.customFields?.length) {
      personModel.customFields = this.customFieldsService.getCustomFieldsDocumentsForInputData(
        personInfo.customFields,
      )
    }

    if (personInfo.documents?.length) {
      personModel.documents = this.idDocumentsService.getDocumentsModelsFromInputData(
        personInfo.documents,
      )
    }

    if (personInfo.files?.length) {
      personModel.files = await this.fileService.getUploadedFilesModels(personInfo.files)
    }

    if (personInfo.relationships?.length) {
      personModel.relationships =
        await this.relationshipsService.getRelationshipsModelsFromInputData(
          personInfo.relationships,
        )
    }

    if (personInfo.image) {
      personModel.image = await this.fileService.getUploadedFileModel(personInfo.image)
    }
    return personModel
  }
}
