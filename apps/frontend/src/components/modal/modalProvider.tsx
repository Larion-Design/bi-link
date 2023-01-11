import React, { PropsWithChildren, useContext, useReducer } from 'react'
import Modal from '@mui/material/Modal'
import { PersonSelector } from './entitySelector/personSelector'
import { CompanySelector } from './entitySelector/companySelector'
import {
  EntitySelectorModal,
  EntitySelectorModalActions,
  EntitySelectorModalContext,
  EntitySelectorPayload,
} from './entitySelector/types'
import { ImageGallery } from './imageGallery'
import { PropertySelector } from './entitySelector/propertySelector'
import {
  ImageGalleryModal,
  ImageGalleryModalActions,
  ImageGalleryModalContext,
  ImageGalleryPayload,
} from './imageGallery/types'
import { ImageSelector } from './imageSelector/imageSelector'
import {
  ImageSelectorModal,
  ImageSelectorModalActions,
  ImageSelectorModalContext,
  ImageSelectorPayload,
} from './imageSelector/types'

type ModalInfo<T = EntitySelectorPayload | ImageSelectorPayload | ImageGalleryPayload> = {
  open: boolean
  modal: EntitySelectorModal | ImageGalleryModal | ImageSelectorModal | null
  modalClosed?: () => void
} & T

const initialState: ModalInfo = {
  modal: null,
  open: false,
}

type Action = EntitySelectorModalActions | ImageGalleryModalActions | ImageSelectorModalActions

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
          const { images, selectedImages, modalClosed } = action.payload
          return {
            modal,
            modalClosed,
            open: true,
            images,
            selectedImages,
          }
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
        openImageSelector: (images, selectedImages, modalClosed) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'imageSelector',
              modalClosed,
              images,
              selectedImages,
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
                  images={state.images ?? []}
                  imagesSelected={state.selectedImages}
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

type Context = EntitySelectorModalContext & ImageGalleryModalContext & ImageSelectorModalContext
const ModalContext = React.createContext<Context | null>(null)
export const useModal = () => useContext(ModalContext)
