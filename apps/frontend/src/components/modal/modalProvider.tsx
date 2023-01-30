import React, { PropsWithChildren, useContext, useReducer } from 'react'
import Modal from '@mui/material/Modal'
import { PersonSelector } from './entitySelector'
import { CompanySelector } from './entitySelector'
import {
  EntitySelectorModal,
  EntitySelectorModalActions,
  EntitySelectorModalContext,
  EntitySelectorPayload,
} from './entitySelector'
import {
  FileSelectorModal,
  FileSelectorModalActions,
  FileSelectorModalContext,
  FileSelectorPayload,
} from './fileSelector'
import { ImageGallery } from './imageGallery'
import { PropertySelector } from './entitySelector'
import {
  ImageGalleryModal,
  ImageGalleryModalActions,
  ImageGalleryModalContext,
  ImageGalleryPayload,
} from './imageGallery'
import { ImageSelector } from './imageSelector'
import {
  ImageSelectorModal,
  ImageSelectorModalActions,
  ImageSelectorModalContext,
  ImageSelectorPayload,
} from './imageSelector'

type ModalInfo<
  T = EntitySelectorPayload | ImageSelectorPayload | ImageGalleryPayload | FileSelectorPayload,
> = {
  open: boolean
  modal: EntitySelectorModal | ImageGalleryModal | ImageSelectorModal | FileSelectorModal | null
  modalClosed?: () => void
} & T

const initialState: ModalInfo = {
  modal: null,
  open: false,
}

type Action =
  | EntitySelectorModalActions
  | ImageGalleryModalActions
  | ImageSelectorModalActions
  | FileSelectorModalActions

const modalReducer = (state: ModalInfo, action: Action): ModalInfo => {
  switch (action.type) {
    case 'openModal': {
      const { modal } = action.payload

      switch (modal) {
        case 'companySelector':
        case 'propertySelector':
        case 'personSelector': {
          const { entitiesSelected, entitiesExcluded, modalClosed } = action.payload
          return {
            modal,
            entitiesExcluded,
            entitiesSelected,
            modalClosed,
            open: true,
          }
        }
        case 'imageGallery': {
          const { images, setImages, modalClosed } = action.payload
          return {
            modal,
            modalClosed,
            open: true,
            images,
            setImages,
          }
        }
        case 'imageSelector': {
          const { images, selectedImages, selectImages, modalClosed } = action.payload
          return {
            modal,
            modalClosed,
            open: true,
            images,
            selectImages,
            selectedImages,
          }
        }
        case 'fileSelector': {
          const { files, selectFile, selectedFile, modalClosed } = action.payload
          return { modal, open: true, files, selectFile, selectedFile, modalClosed }
        }
      }
      break
    }
    case 'closeModal': {
      state.modalClosed?.()
      return initialState
    }
    default: {
      return initialState
    }
  }
}

export const ModalProvider: React.FunctionComponent<PropsWithChildren<any>> = ({ children }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState)
  const { open, modal } = state

  return (
    <ModalContext.Provider
      value={{
        openPersonSelector: (entitiesSelected, entitiesExcluded, modalClosed) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'personSelector',
              entitiesSelected,
              entitiesExcluded,
              modalClosed,
            },
          }),
        openCompanySelector: (entitiesSelected, entitiesExcluded, modalClosed) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'companySelector',
              entitiesSelected,
              entitiesExcluded,
              modalClosed,
            },
          }),
        openPropertySelector: (entitiesSelected, entitiesExcluded, modalClosed) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'propertySelector',
              entitiesSelected,
              entitiesExcluded,
              modalClosed,
            },
          }),
        openImageGallery: (images, setImages, modalClosed) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'imageGallery',
              modalClosed,
              images,
              setImages,
            },
          }),
        openImageSelector: (images, selectImages, selectedImages, modalClosed) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'imageSelector',
              modalClosed,
              images,
              selectImages,
              selectedImages,
            },
          }),
        openFileSelector: (files, selectFile, selectedFile, modalClosed) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'fileSelector',
              modalClosed,
              files,
              selectFile,
              selectedFile,
            },
          }),
      }}
    >
      {open ? (
        <>
          {modal === 'personSelector' && (
            <Modal open={true}>
              <>
                <PersonSelector
                  closeModal={() => dispatch({ type: 'closeModal', payload: 'personSelector' })}
                  personsSelected={state.entitiesSelected}
                  excludedPersonsIds={state.entitiesExcluded}
                />
              </>
            </Modal>
          )}
          {modal === 'companySelector' && (
            <Modal open={true}>
              <>
                <CompanySelector
                  closeModal={() => dispatch({ type: 'closeModal', payload: 'companySelector' })}
                  companiesSelected={state.entitiesSelected}
                  excludedCompaniesIds={state.entitiesExcluded}
                />
              </>
            </Modal>
          )}
          {modal === 'propertySelector' && (
            <Modal open={true}>
              <>
                <PropertySelector
                  closeModal={() => dispatch({ type: 'closeModal', payload: 'propertySelector' })}
                  propertiesSelected={state.entitiesSelected}
                  excludedPropertiesIds={state.entitiesExcluded}
                />
              </>
            </Modal>
          )}
          {modal === 'imageGallery' && (
            <Modal open={true}>
              <>
                <ImageGallery
                  closeModal={() => dispatch({ type: 'closeModal', payload: 'imageGallery' })}
                  images={state.images ?? []}
                  setImages={state.setImages}
                />
              </>
            </Modal>
          )}
          {modal === 'imageSelector' && (
            <Modal open={true}>
              <>
                <ImageSelector
                  closeModal={() => dispatch({ type: 'closeModal', payload: 'imageSelector' })}
                  images={state.images}
                  selectImages={state.selectImages}
                  selectedImages={state.selectedImages}
                />
              </>
            </Modal>
          )}
        </>
      ) : null}
      {children}
    </ModalContext.Provider>
  )
}

type Context = EntitySelectorModalContext &
  ImageGalleryModalContext &
  ImageSelectorModalContext &
  FileSelectorModalContext
const ModalContext = React.createContext<Context | null>(null)
export const useModal = () => useContext(ModalContext)
