import { Injectable, Logger } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { format } from 'date-fns'
import { INDEX_PERSONS } from '@app/definitions'
import { Education, IdDocument, Person } from 'defs'
import { LocationIndexerService } from './locationIndexerService'
import { PersonIndex } from '@app/definitions'

@Injectable()
export class PersonsIndexerService {
  private readonly index = INDEX_PERSONS
  private readonly logger = new Logger(PersonsIndexerService.name)

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly locationIndexerService: LocationIndexerService,
  ) {}

  indexPerson = async (personId: string, personDocument: Person) => {
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

  private createIndexData = (person: Person): PersonIndex => ({
    firstName: person.firstName,
    lastName: person.lastName,
    oldNames: person.oldNames,
    cnp: person.cnp,
    homeAddress: person.homeAddress
      ? this.locationIndexerService.createLocationIndexData(person.homeAddress)
      : undefined,
    birthPlace: person.birthPlace
      ? this.locationIndexerService.createLocationIndexData(person.birthPlace)
      : undefined,
    birthdate: person.birthdate.value
      ? format(new Date(person.birthdate.value), 'yyyy-mm-dd')
      : undefined,
    contactDetails: person.contactDetails,
    documents: this.createIdDocumentsIndex(person.documents),
    customFields: person.customFields,
    education: this.createEducationIndex(person.education),
    files: [],
  })

  private createIdDocumentsIndex = (documents: IdDocument[]): PersonIndex['documents'] =>
    documents.map(({ documentNumber, status, expirationDate, issueDate }) => ({
      documentNumber,
      status,
      validity: {
        gte: issueDate ? format(new Date(issueDate), 'yyyy-mm-dd') : null,
        lte: expirationDate ? format(new Date(expirationDate), 'yyyy-mm-dd') : null,
      },
    }))

  private createEducationIndex = (education: Education[]): PersonIndex['education'] =>
    education.map(({ startDate, endDate, specialization, type, school }) => ({
      school,
      type,
      specialization,
      period: {
        gte: startDate ? format(new Date(startDate), 'yyyy') : null,
        lte: endDate ? format(new Date(endDate), 'yyyy') : null,
      },
    }))
}
