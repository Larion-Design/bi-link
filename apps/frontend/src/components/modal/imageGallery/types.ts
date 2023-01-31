import { FileAPIInput } from 'defs'

export type ImageGalleryModal = 'imageGallery'
type ImageGalleryUpdated = (images: FileAPIInput[]) => void

export interface ImageGalleryPayload {
  modal: ImageGalleryModal
  images?: FileAPIInput[]
  setImages?: ImageGalleryUpdated
  modalClosed?: () => void
}

export type ImageGalleryModalActions =
  | {
      type: 'openModal'
      payload: {
        modal: ImageGalleryModal
        images?: FileAPIInput[]
        setImages?: ImageGalleryUpdated
        modalClosed?: () => void
      }
    }
  | {
      type: 'closeModal'
      payload: ImageGalleryModal
    }

export type ImageGalleryModalContext = {
  openImageGallery: (
    images: FileAPIInput[],
    setImages: ImageGalleryUpdated,
    modalClosed?: () => void,
  ) => void
}
