export enum FileParentEntity {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY',
  INCIDENT = 'INCIDENT',
  PROPERTY = 'PROPERTY',
}

export type FileLinkedEntity = {
  type: FileParentEntity
  id: string
}

export type FileEventInfo = {
  linkedEntity?: FileLinkedEntity
  fileId: string
}
