import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { format } from 'date-fns'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { PersonEventDispatcherService } from '../../../producers/services/personEventDispatcherService'
import { IdDocument, IdDocumentStatus } from '@app/definitions/idDocument'
import { INDEX_PERSONS } from '@app/definitions/constants'
import { PersonIndex } from '@app/definitions/person'
import { PersonsService } from '@app/entities/services/personsService'

@Injectable()
export class PersonsIndexerService {
  private readonly index = INDEX_PERSONS
  private readonly logger = new Logger(PersonsIndexerService.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly personEventDispatcherService: PersonEventDispatcherService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  indexPerson = async (personId: string, personDocument: PersonDocument) => {
    try {
      const { _id } = await this.elasticsearchService.index<PersonIndex>({
        index: this.index,
        id: personId,
        document: this.createIndexData(personDocument),
        refresh: true,
      })

      return _id === personId
    } catch (error) {
      this.logger.error(error)
    }
  }

  indexAllPersons = async () => {
    const personsIds: string[] = []

    for await (const { _id } of this.personsService.getPersons()) {
      personsIds.push(String(_id))
    }

    if (personsIds.length) {
      await this.personEventDispatcherService.dispatchPersonsUpdated(personsIds)
    }
  }

  private createIndexData = (person: PersonModel): PersonIndex => ({
    firstName: person.firstName,
    lastName: person.lastName,
    oldName: person.oldName,
    cnp: person.cnp,
    homeAddress: person.homeAddress,
    birthdate: person.birthdate ? format(person.birthdate as Date, 'yyyy-mm-dd') : null,
    contactDetails: person.contactDetails,
    documents: this.createIdDocumentsIndex(person.documents),
    customFields: person.customFields,
    files: [],
  })

  private createIdDocumentsIndex = (documents: IdDocument[]): PersonIndex['documents'] =>
    documents.map(({ documentNumber, status, expirationDate, issueDate }) => ({
      documentNumber,
      status: status ?? IdDocumentStatus.VALID,
      validity: {
        gte: issueDate,
        lte: expirationDate,
      },
    }))
}
