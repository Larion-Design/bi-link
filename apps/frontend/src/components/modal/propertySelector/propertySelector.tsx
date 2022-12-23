import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { SearchProperties } from './searchProperties'
import { FastCreateProperty } from './fastCreateProperty'

export type PropertySelectorView = 'search' | 'createProperty'

type Props = {
  closeModal: () => void
  propertiesSelected?: (propertiesIds: string[]) => void
  excludedPropertiesIds?: string[]
}

export const PropertySelector: React.FunctionComponent<Props> = ({
  closeModal,
  propertiesSelected,
  excludedPropertiesIds,
}) => {
  const [view, setView] = useState<PropertySelectorView>('search')

  return (
    <Card sx={{ p: 2, width: '80vw', height: '90vh' }} variant={'elevation'}>
      {view === 'search' && (
        <SearchProperties
          closeModal={closeModal}
          changeView={setView}
          propertiesSelected={propertiesSelected}
          excludedPropertiesIds={excludedPropertiesIds}
        />
      )}
      {view === 'createProperty' && (
        <FastCreateProperty
          closeModal={closeModal}
          changeView={setView}
          propertiesSelected={propertiesSelected}
        />
      )}
    </Card>
  )
}
