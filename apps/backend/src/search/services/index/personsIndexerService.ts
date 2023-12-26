import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { formatDate, formatYear } from 'tools';
import { INDEX_PERSONS } from '../../constants';
import { Education, IdDocument, OldName, Person } from 'defs';
import { LocationIndexerService } from './locationIndexerService';
import {
  EducationIndex,
  IdDocumentIndex,
  OldNameIndex,
  PersonIndex,
} from '@modules/definitions';

@Injectable()
export class PersonsIndexerService {
  private readonly index = INDEX_PERSONS;
  private readonly logger = new Logger(PersonsIndexerService.name);

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly locationIndexerService: LocationIndexerService,
  ) {}

  async indexPerson(personId: string, personDocument: Person) {
    try {
      const { _id } = await this.elasticsearchService.index<PersonIndex>({
        index: this.index,
        id: personId,
        document: this.createIndexData(personDocument),
      });

      return _id === personId;
    } catch (error) {
      this.logger.error(error);
    }
  }

  private createIndexData = (person: Person): PersonIndex => ({
    firstName: person.firstName.value,
    lastName: person.lastName.value,
    oldNames: this.createOldNamesIndex(person.oldNames),
    cnp: person.cnp.value,
    homeAddress: person.homeAddress
      ? this.locationIndexerService.createLocationIndexData(person.homeAddress)
      : undefined,
    birthPlace: person.birthPlace
      ? this.locationIndexerService.createLocationIndexData(person.birthPlace)
      : undefined,
    birthdate: person.birthdate.value
      ? formatDate(person.birthdate.value)
      : undefined,
    contactDetails: person.contactDetails,
    documents: this.createIdDocumentsIndex(person.documents),
    customFields: person.customFields,
    education: this.createEducationIndex(person.education),
    files: [],
  });

  private createIdDocumentsIndex = (
    documents: IdDocument[],
  ): IdDocumentIndex[] =>
    documents.map(({ documentNumber, status, expirationDate, issueDate }) => ({
      documentNumber,
      status,
      validity: {
        gte: issueDate ? formatDate(issueDate) : null,
        lte: expirationDate ? formatDate(expirationDate) : null,
      },
    }));

  private createEducationIndex = (education: Education[]): EducationIndex[] =>
    education.map(({ startDate, endDate, specialization, type, school }) => ({
      school,
      type,
      specialization,
      period: {
        gte: startDate ? formatYear(startDate) : undefined,
        lte: endDate ? formatYear(endDate) : undefined,
      },
    }));

  private createOldNamesIndex = (oldNames: OldName[]): OldNameIndex[] =>
    oldNames.map(({ name, changeReason }) => ({
      name,
      changeReason,
    }));
}
