import Stack from '@mui/material/Stack'
import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { CompanyAPIInput } from 'defs'
import { useCompanyState } from '../../state/company/companyState'
import { Reports } from '../entityViews/reports'
import { InputFieldMenu } from '../menu/inputFieldMenu'
import { CompanyForm } from '../form/company/companyForm'
import { Graph } from '../entityViews/graph'

type Props = {
  companyId?: string
  companyInfo: CompanyAPIInput
  onSubmit: (data: CompanyAPIInput) => void
  applySnapshot?: (snapshotId: string) => void | Promise<void>
}

export const CompanyDetails: React.FunctionComponent<Props> = ({
  companyId,
  companyInfo,
  onSubmit,
}) => {
  const [mainTabIndex, setMainTabIndex] = useState(0)
  const canChangeView = !!companyId
  const setCompanyInfo = useCompanyState(({ setCompanyInfo }) => setCompanyInfo)

  useEffect(() => setCompanyInfo(companyInfo), [companyInfo, setCompanyInfo])

  return (
    <Stack sx={{ width: 1, p: 4, mt: 2 }} spacing={4}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
        sx={{ width: 1 }}
      >
        <Typography variant={'h5'} data-cy={'pageTitle'} gutterBottom>
          {!!companyId && !!companyInfo
            ? `Detalii despre ${companyInfo.name.value}`
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
      </Stack>

      <Box sx={{ width: 1 }}>
        {mainTabIndex === 0 && <CompanyForm companyId={companyId} onSubmit={onSubmit} />}
        {mainTabIndex === 1 && !!companyId && (
          <Box sx={{ height: '70vh' }}>
            <Graph entityId={companyId} />
          </Box>
        )}
        {mainTabIndex === 3 && !!companyId && (
          <Reports entityId={companyId} entityType={'COMPANY'} />
        )}
      </Box>
    </Stack>
  )
}
