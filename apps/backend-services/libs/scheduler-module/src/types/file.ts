export enum FileParentEntity {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY',
  EVENT = 'EVENT',
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
