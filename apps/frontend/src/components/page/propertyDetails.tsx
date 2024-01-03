import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { usePropertyState } from '../../state/property/propertyState'
import { Reports } from '../entityViews/reports'
import { InputFieldMenu } from '../menu/inputFieldMenu'
import { Graph } from '../entityViews/graph'
import { PropertyAPIInput } from 'defs'
import { PropertyForm } from '../form/property/propertyForm'

type Props = {
  propertyId?: string
  propertyInfo: PropertyAPIInput
  onSubmit: (data: PropertyAPIInput) => void
}

export const PropertyDetails: React.FunctionComponent<Props> = ({
  propertyId,
  propertyInfo,
  onSubmit,
}) => {
  const [mainTabIndex, setMainTabIndex] = useState(0)
  const setPropertyInfo = usePropertyState(({ setPropertyInfo }) => setPropertyInfo)

  useEffect(() => setPropertyInfo(propertyInfo), [propertyInfo])

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
        <Typography variant={'h5'} data-cy={'pageTitle'} gutterBottom>
          {!propertyId ? 'Creaza o proprietate' : `Detalii despre ${propertyInfo.name}`}
        </Typography>
        {!!propertyId && (
          <InputFieldMenu label={'Optiuni'}>
            <MenuItem onClick={() => setMainTabIndex(0)}>Informatii</MenuItem>
            <MenuItem disabled={!propertyId} onClick={() => setMainTabIndex(1)}>
              Grafic relational
            </MenuItem>
            <MenuItem onClick={() => setMainTabIndex(3)}>Rapoarte</MenuItem>
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
        {mainTabIndex === 0 && <PropertyForm propertyId={propertyId} onSubmit={onSubmit} />}
        {mainTabIndex === 1 && !!propertyId && (
          <Box sx={{ height: '70vh' }}>
            <Graph entityId={propertyId} />
          </Box>
        )}
        {mainTabIndex === 3 && !!propertyId && (
          <Reports entityId={propertyId} entityType={'PROPERTY'} />
        )}
      </Box>
    </Box>
  )
}
