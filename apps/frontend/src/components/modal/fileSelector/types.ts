import { FileAPIInput } from 'defs'

export type FileSelectorModal = 'fileSelector'
type SelectedFileHandler = (fileInfo: FileAPIInput) => void

export interface FileSelectorPayload {
  modal: FileSelectorModal
  files: FileAPIInput[]
  selectFile: SelectedFileHandler
  selectedFile: FileAPIInput | null
  modalClosed?: () => void
}

export type FileSelectorModalActions =
  | {
      type: 'openModal'
      payload: FileSelectorPayload
    }
  | {
      type: 'closeModal'
      payload: FileSelectorModal
    }

export type FileSelectorModalContext = {
  openFileSelector: (
    files: FileAPIInput[],
    selectFile: SelectedFileHandler,
    selectedFile: FileAPIInput,
    modalClosed?: () => void,
  ) => void
}
