export enum IdDocumentStatus {
  VALID = 'VALID',
  EXPIRED = 'EXPIRED',
  LOST_OR_STOLEN = 'LOST_OR_STOLEN',
}

export interface IdDocument {
  documentType: string
  documentNumber: string
  issueDate?: Date | string
  expirationDate?: Date | string
  status: IdDocumentStatus
}

export interface IdDocumentAPI extends IdDocument {}
