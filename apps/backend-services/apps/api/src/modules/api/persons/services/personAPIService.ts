import {PersonModel} from '@app/entities/models/personModel'
import {PersonsService} from '@app/entities/services/personsService'
import {Injectable, Logger} from '@nestjs/common'
import {CustomFieldsService} from '../../customFields/services/customFieldsService'
import {FileAPIService} from '../../files/services/fileAPIService'
import {PersonInput} from '../dto/personInput'
import {IdDocumentsService} from './idDocumentsService'
import {RelationshipsService} from './relationshipsService'

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

    personModel.contactDetails = personInfo.contactDetails.length
      ? this.customFieldsService.getCustomFieldsDocumentsForInputData(personInfo.contactDetails)
      : []

    personModel.customFields = personInfo.customFields.length
      ? this.customFieldsService.getCustomFieldsDocumentsForInputData(personInfo.customFields)
      : []

    personModel.documents = personInfo.documents.length
      ? this.idDocumentsService.getDocumentsModelsFromInputData(personInfo.documents)
      : []

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
}
