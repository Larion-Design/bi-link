import { Injectable } from '@nestjs/common'
import { IdDocumentModel } from '@app/entities/models/idDocumentModel'
import { IdDocument } from '@app/definitions/idDocument'

@Injectable()
export class IdDocumentsService {
  getDocumentsModelsFromInputData = (idDocuments: IdDocument[]) =>
    idDocuments.map((idDocument) => new IdDocumentModel(idDocument))
}
