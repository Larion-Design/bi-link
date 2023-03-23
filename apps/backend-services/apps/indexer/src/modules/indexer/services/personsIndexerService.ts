import { PersonIndex } from '@app/definitions'
import { EducationModel } from '@app/models'
import { IdDocumentModel } from '@app/models'
import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { format } from 'date-fns'
import { PersonDocument, PersonModel } from '@app/models'
import { INDEX_PERSONS } from '@app/definitions'
import { PersonsService } from '@app/models'
import { LocationIndexerService } from './locationIndexerService'

@Injectable()
export class PersonsIndexerService {
  private readonly index = INDEX_PERSONS
  private readonly logger = new Logger(PersonsIndexerService.name)

  constructor(
    private readonly personsService: PersonsService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly locationIndexerService: LocationIndexerService,
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

  private createIndexData = (person: PersonModel): PersonIndex => ({
    firstName: person.firstName,
    lastName: person.lastName,
    oldNames: person.oldNames,
    cnp: person.cnp,
    homeAddress: person.homeAddress
      ? this.locationIndexerService.createLocationIndexData(person.homeAddress)
      : null,
    birthPlace: person.birthPlace
      ? this.locationIndexerService.createLocationIndexData(person.birthPlace)
      : null,
    birthdate: person.birthdate ? format(new Date(person.birthdate), 'yyyy-mm-dd') : null,
    contactDetails: person.contactDetails,
    documents: this.createIdDocumentsIndex(person.documents),
    customFields: person.customFields,
    education: this.createEducationIndex(person.education),
    files: [],
  })

  private createIdDocumentsIndex = (documents: IdDocumentModel[]): PersonIndex['documents'] =>
    documents.map(({ documentNumber, status, expirationDate, issueDate }) => ({
      documentNumber,
      status,
      validity: {
        gte: issueDate ? format(new Date(issueDate), 'yyyy-mm-dd') : null,
        lte: expirationDate ? format(new Date(expirationDate), 'yyyy-mm-dd') : null,
      },
    }))

  private createEducationIndex = (education: EducationModel[]): PersonIndex['education'] =>
    education.map(({ startDate, endDate, customFields, specialization, type, school }) => ({
      school,
      type,
      specialization,
      customFields,
      period: {
        gte: startDate ? format(new Date(startDate), 'yyyy') : null,
        lte: endDate ? format(new Date(endDate), 'yyyy') : null,
      },
    }))
}
