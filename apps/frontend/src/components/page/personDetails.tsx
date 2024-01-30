import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { PersonAPIInput } from 'defs'
import { usePersonState } from 'state/personState'
import { getPersonFullName } from 'utils/person'
import { Graph } from '../entityViews/graph'
import { Reports } from '../entityViews/reports'
import { PersonForm } from '../form/person/personForm'
import { InputFieldMenu } from '../menu/inputFieldMenu'

type Props = {
  personId?: string
  personInfo?: PersonAPIInput
  onSubmit: (data: PersonAPIInput) => void
}

export const PersonDetails: React.FunctionComponent<Props> = ({
  personId,
  personInfo,
  onSubmit,
}) => {
  const setPersonInfo = usePersonState(({ setPersonInfo }) => setPersonInfo)
  const [mainTabIndex, setMainTabIndex] = useState(0)
  const canSwitchViews = !!personId

  useEffect(() => setPersonInfo(personInfo), [personInfo])

  return (
    <Box sx={{ width: 1, p: 4, mt: 2 }}>
      <Box
        sx={{
          width: 1,
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant={'h5'} data-testid={'pageTitle'} gutterBottom>
          {!!personId && !!personInfo
            ? `Detalii despre ${getPersonFullName(personInfo)}`
            : 'Creaza o persoana'}
        </Typography>
        {!!personId && (
          <InputFieldMenu label={'Optiuni'}>
            <MenuItem onClick={() => setMainTabIndex(0)}>Informatii</MenuItem>
            <MenuItem disabled={!canSwitchViews} onClick={() => setMainTabIndex(1)}>
              Grafic relational
            </MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(3)}>
              Rapoarte
            </MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(2)}>
              Evenimente
            </MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(4)}>
              Conflicte
            </MenuItem>
          </InputFieldMenu>
        )}
      </Box>

      <Box sx={{ width: 1 }}>
        {mainTabIndex === 0 && <PersonForm personId={personId} onSubmit={onSubmit} />}
        {mainTabIndex === 1 && !!personId && (
          <Box sx={{ height: '70vh' }}>
            <Graph entityId={personId} />
          </Box>
        )}
        {mainTabIndex === 3 && !!personId && <Reports entityId={personId} entityType={'PERSON'} />}
      </Box>
    </Box>
  )
}
