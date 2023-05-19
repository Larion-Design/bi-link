import { MetadataDiffService } from '@app/diff-module/services/metadataDiffService'
import { FileAPIInput } from 'defs'

export class FileDiffService {
  constructor(private readonly metadataDiffService: MetadataDiffService) {}

  areFilesEqual = (fileA: FileAPIInput, fileB: FileAPIInput) => {
    return (
      fileA.fileId === fileB.fileId &&
      fileA.name === fileB.name &&
      fileA.isHidden === fileB.isHidden &&
      fileA.description === fileB.description &&
      this.metadataDiffService.areObjectsEqual(fileA.metadata, fileB.metadata)
    )
  }

  areFilesListsEqual = (listA: FileAPIInput[], listB: FileAPIInput[]) =>
    listA.length === listB.length &&
    listA.every((itemA) => listB.some((itemB) => this.areFilesEqual(itemA, itemB)))
}
