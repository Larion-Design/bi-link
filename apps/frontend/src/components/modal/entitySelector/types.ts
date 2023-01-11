export type EntitySelectorModal = 'companySelector' | 'personSelector' | 'propertySelector'

type EntitySelectorHandler = (entitiesIds: string[]) => void

type EntitySelector = (
  entitiesSelected: EntitySelectorHandler,
  entitiesExcluded?: string[],
  modalClosed?: () => void,
) => void

export type EntitySelectorPayload = {
  modal: EntitySelectorModal
  entitiesSelected?: EntitySelectorHandler
  entitiesExcluded?: string[]
  modalClosed?: () => void
}

export type EntitySelectorModalActions =
  | {
      type: 'openModal'
      payload: EntitySelectorPayload
    }
  | {
      type: 'closeModal'
      payload: EntitySelectorModal
    }

export type EntitySelectorModalContext = {
  openPersonSelector: EntitySelector
  openCompanySelector: EntitySelector
  openPropertySelector: EntitySelector
}
