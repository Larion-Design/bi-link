import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { CompanyAPIInput } from 'defs'
import { Reports } from '../entityViews/reports'
import { InputFieldMenu } from '../menu/inputFieldMenu'
import { CompanyForm } from '../form/company/companyForm'
import { Graph } from '../entityViews/graph'

type Props = {
  companyId?: string
  companyInfo?: CompanyAPIInput
  readonly: boolean
  onSubmit: (data: CompanyAPIInput) => void | Promise<void>
}

export const CompanyDetails: React.FunctionComponent<Props> = ({
  companyId,
  companyInfo,
  readonly,
  onSubmit,
}) => {
  const [mainTabIndex, setMainTabIndex] = useState(0)
  const canChangeView = !!companyId

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
          {!!companyId && !!companyInfo
            ? `Detalii despre ${companyInfo.name}`
            : 'Creaza o companie'}
        </Typography>
        {!!companyId && (
          <InputFieldMenu label={'Optiuni'}>
            <MenuItem onClick={() => setMainTabIndex(0)}>Informatii</MenuItem>
            <MenuItem disabled={!canChangeView} onClick={() => setMainTabIndex(1)}>
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
        {mainTabIndex === 0 && (
          <CompanyForm
            companyId={companyId}
            companyInfo={companyInfo}
            readonly={readonly}
            onSubmit={onSubmit}
          />
        )}
        {mainTabIndex === 1 && !!companyId && (
          <Box sx={{ height: '70vh' }}>
            <Graph entityId={companyId} />
          </Box>
        )}
        {mainTabIndex === 3 && !!companyId && (
          <Reports entityId={companyId} entityType={'COMPANY'} />
        )}
      </Box>
    </Box>
  )
}
