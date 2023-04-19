import { FileAPIInput } from 'defs'
import { StateCreator } from 'zustand'
import { removeMapItems } from './utils'

export type FilesState = {
  files: Map<string, FileAPIInput>
  setFiles: (files: FileAPIInput[]) => void
  addFile: (fileInfo: FileAPIInput) => void
  updateFile: (fileInfo: FileAPIInput) => void
  removeFiles: (ids: string[]) => void
}

export const createFilesStore: StateCreator<FilesState, [], [], FilesState> = (set, getState) => ({
  files: new Map(),

  setFiles: (files) => {
    const filesMap = new Map<string, FileAPIInput>()
    files.forEach((fileInfo) => filesMap.set(fileInfo.fileId, fileInfo))
    set({ files: filesMap })
  },

  updateFile: (fileInfo) =>
    set({ files: new Map(getState().files).set(fileInfo.fileId, fileInfo) }),

  addFile: (fileInfo) => {
    const filesMap = getState().files

    if (!filesMap.has(fileInfo.fileId)) {
      set({ files: new Map(filesMap).set(fileInfo.fileId, fileInfo) })
    }
  },

  removeFiles: (ids) => set({ files: removeMapItems(getState().files, ids) }),
})
