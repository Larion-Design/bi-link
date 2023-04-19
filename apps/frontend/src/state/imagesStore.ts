import { FileAPIInput } from 'defs'
import { StateCreator } from 'zustand'
import { removeMapItems } from './utils'

export type ImagesState = {
  images: Map<string, FileAPIInput>
  setImages: (files: FileAPIInput[]) => void
  addImage: (fileInfo: FileAPIInput) => void
  updateImage: (fileInfo: FileAPIInput) => void
  removeImages: (ids: string[]) => void
}

export const createImagesStore: StateCreator<ImagesState, [], [], ImagesState> = (
  set,
  get,
  store,
) => ({
  images: new Map(),

  setImages: (files) => {
    const filesMap = new Map<string, FileAPIInput>()
    files.forEach((fileInfo) => filesMap.set(fileInfo.fileId, fileInfo))
    set({ images: filesMap })
  },

  updateImage: (fileInfo) => set({ images: new Map(get().images).set(fileInfo.fileId, fileInfo) }),

  addImage: (fileInfo) => {
    const filesMap = get().images

    if (!filesMap.has(fileInfo.fileId)) {
      set({ images: new Map(filesMap).set(fileInfo.fileId, fileInfo) })
    }
  },

  removeImages: (ids) => set({ images: removeMapItems(get().images, ids) }),
})
