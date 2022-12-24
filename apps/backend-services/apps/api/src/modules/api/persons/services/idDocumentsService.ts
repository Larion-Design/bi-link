import { Injectable } from '@nestjs/common'
import { IdDocumentModel } from '@app/entities/models/idDocumentModel'
import { IdDocument } from 'defs'

@Injectable()
export class IdDocumentsService {
  getDocumentsModelsFromInputData = (idDocuments: IdDocument[]) =>
    idDocuments.map((idDocument) => new IdDocumentModel(idDocument))
}
