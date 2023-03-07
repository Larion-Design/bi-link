import { IdDocument } from 'defs'

export interface IdDocumentIndex extends Pick<IdDocument, 'documentNumber' | 'status'> {
  validity: {
    gte?: IdDocument['issueDate']
    lte?: IdDocument['expirationDate']
  }
}
