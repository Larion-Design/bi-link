import React, { PropsWithChildren, useContext, useReducer } from 'react'
import Modal from '@mui/material/Modal'
import { PersonSelector } from './personSelector'
import { CompanySelector } from './companySelector'
import { FileAPIInput } from '../../types/file'
import { ImageGallery } from './imageGallery'
import { PropertySelector } from './propertySelector'

type BaseModalInfo<T extends string, K extends object> = {
  modal: T | null
  open: boolean
  params: K
}

type EntitySelectorModal = BaseModalInfo<
  'companySelector' | 'personSelector' | 'propertySelector',
  {
    entitiesSelected?: EntitySelectorHandler
    entitiesExcluded?: string[]
  }
>

type ImageGalleryModal = BaseModalInfo<
  'imageGallery',
  {
    images: FileAPIInput[]
  }
>

type ModalInfo = {
  modal:
    | 'companySelector'
    | 'personSelector'
    | 'propertySelector'
    | 'imageGallery'
    | null
  open: boolean
  entitiesSelected?: (entitiesIds: string[]) => void
  modalClosed?: () => void
  entitiesExcluded?: string[]
  images?: FileAPIInput[]
}

const initialState: ModalInfo = {
  modal: null,
  open: false,
}

type EntitySelectorHandler = (entitiesIds: string[]) => void

type Action =
  | {
      type: 'openModal'
      payload: {
        modal: ModalInfo['modal']
        entitiesSelected?: EntitySelectorHandler
        entitiesExcluded?: string[]
        modalClosed?: () => void
        images?: FileAPIInput[]
      }
    }
  | {
      type: 'closeModal'
      payload: NonNullable<ModalInfo['modal']>
    }

const modalReducer = (state: ModalInfo, action: Action): ModalInfo => {
  switch (action.type) {
    case 'openModal': {
      const { modal, entitiesSelected, entitiesExcluded, modalClosed, images } =
        action.payload
      return {
        modal,
        entitiesExcluded,
        entitiesSelected,
        modalClosed,
        open: true,
        images,
      }
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

export const ModalProvider: React.FunctionComponent<PropsWithChildren<any>> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(modalReducer, initialState)
  const { open, modal, entitiesSelected, entitiesExcluded, images } = state

  return (
    <ModalContext.Provider
      value={{
        openPersonSelector: (
          entitiesSelected: EntitySelectorHandler,
          entitiesExcluded?: string[],
          modalClosed?: () => void,
        ) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'personSelector',
              entitiesSelected,
              entitiesExcluded,
              modalClosed,
            },
          }),
        openCompanySelector: (
          entitiesSelected: EntitySelectorHandler,
          entitiesExcluded?: string[],
          modalClosed?: () => void,
        ) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'companySelector',
              entitiesSelected,
              entitiesExcluded,
              modalClosed,
            },
          }),
        openPropertySelector: (
          entitiesSelected: EntitySelectorHandler,
          entitiesExcluded?: string[],
          modalClosed?: () => void,
        ) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'propertySelector',
              entitiesSelected,
              entitiesExcluded,
              modalClosed,
            },
          }),
        openImageGallery: (images: FileAPIInput[], modalClosed?: () => void) =>
          dispatch({
            type: 'openModal',
            payload: {
              modal: 'imageGallery',
              modalClosed,
              images,
            },
          }),
      }}
    >
      <Modal open={open && modal === 'personSelector'}>
        <>
          <PersonSelector
            closeModal={() =>
              dispatch({ type: 'closeModal', payload: 'personSelector' })
            }
            personsSelected={entitiesSelected}
            excludedPersonsIds={entitiesExcluded}
          />
        </>
      </Modal>
      <Modal open={open && modal === 'companySelector'}>
        <>
          <CompanySelector
            closeModal={() =>
              dispatch({ type: 'closeModal', payload: 'companySelector' })
            }
            companiesSelected={entitiesSelected}
            excludedCompaniesIds={entitiesExcluded}
          />
        </>
      </Modal>
      <Modal open={open && modal === 'propertySelector'}>
        <>
          <PropertySelector
            closeModal={() =>
              dispatch({ type: 'closeModal', payload: 'propertySelector' })
            }
            propertiesSelected={entitiesSelected}
            excludedPropertiesIds={entitiesExcluded}
          />
        </>
      </Modal>
      <Modal open={open && modal === 'imageGallery'}>
        <>
          <ImageGallery
            closeModal={() =>
              dispatch({ type: 'closeModal', payload: 'imageGallery' })
            }
            images={images ?? []}
          />
        </>
      </Modal>
      {children}
    </ModalContext.Provider>
  )
}

type EntitySelector = (
  entitiesSelected: EntitySelectorHandler,
  entitiesExcluded?: string[],
  modalClosed?: () => void,
) => void

type Context = {
  openPersonSelector: EntitySelector
  openCompanySelector: EntitySelector
  openPropertySelector: EntitySelector
  openImageGallery: (images: FileAPIInput[], modalClosed?: () => void) => void
}

const ModalContext = React.createContext<Context | null>(null)

export const useModal = () => useContext(ModalContext)
