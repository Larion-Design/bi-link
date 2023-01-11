import { FileAPIInput } from 'defs'

export type ImageSelectorModal = 'imageSelector'
type SelectedImagesHandler = (images: FileAPIInput[]) => void

export interface ImageSelectorPayload {
  modal: ImageSelectorModal
  images?: FileAPIInput[]
  selectedImages: SelectedImagesHandler
  modalClosed?: () => void
}

export type ImageSelectorModalActions =
  | {
      type: 'openModal'
      payload: ImageSelectorPayload
    }
  | {
      type: 'closeModal'
      payload: ImageSelectorModal
    }

export type ImageSelectorModalContext = {
  openImageSelector: (
    images: FileAPIInput[],
    selectedImages: SelectedImagesHandler,
    modalClosed?: () => void,
  ) => void
}
