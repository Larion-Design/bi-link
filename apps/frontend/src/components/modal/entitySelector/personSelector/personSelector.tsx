import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { SearchPersons } from './searchPersons'
import { FastCreatePerson } from './fastCreatePerson'

export type PersonSelectorView = 'search' | 'createPerson'

type Props = {
  closeModal: () => void
  personsSelected?: (personsIds: string[]) => void
  excludedPersonsIds?: string[]
}

export const PersonSelector: React.FunctionComponent<Props> = ({
  closeModal,
  personsSelected,
  excludedPersonsIds,
}) => {
  const [view, setView] = useState<PersonSelectorView>('search')

  return (
    <Card sx={{ p: 2, width: '80vw', height: '90vh' }} variant={'elevation'}>
      {view === 'search' && (
        <SearchPersons
          closeModal={closeModal}
          personsSelected={personsSelected}
          excludedPersonsIds={excludedPersonsIds}
          changeView={setView}
        />
      )}
      {view === 'createPerson' && (
        <FastCreatePerson
          closeModal={closeModal}
          personsSelected={personsSelected}
          changeView={setView}
        />
      )}
    </Card>
  )
}
