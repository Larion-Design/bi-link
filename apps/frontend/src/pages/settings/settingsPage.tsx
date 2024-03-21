import { useRegenerateGraph } from 'api/system/regenerate-graph'
import { useRegenerateIndex } from 'api/system/regenerate-index'
import React from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DashboardPage } from 'components/page/DashboardPage'

export function SettingsPage() {
  const [regenerateGraph, { loading: regenerateGraphLoading }] = useRegenerateGraph()
  const [regenerateIndex, { loading: regenerateIndexLoading }] = useRegenerateIndex()

  return (
    <DashboardPage title="Setari">
      <Stack p={4} width={1} spacing={2}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant={'h5'} data-testid={'pageTitle'} flex={2}>
            Setari
          </Typography>
        </Stack>
      </Stack>
      <Stack alignContent="flex-start" spacing={4}>
        <Button
          size={'medium'}
          variant={'contained'}
          onClick={() => void regenerateGraph()}
          disabled={regenerateGraphLoading}
        >
          <Tooltip title={'Regenereaza grafic relational'}>
            <Typography variant={'caption'} data-testid={'pageTitle'} flex={2}>
              Regenereaza grafic relational
            </Typography>
          </Tooltip>
        </Button>

        <Button
          size={'medium'}
          variant={'contained'}
          onClick={() => void regenerateIndex()}
          disabled={regenerateIndexLoading}
        >
          <Tooltip title={'Regenereaza index cautare'}>
            <Typography variant={'caption'} data-testid={'pageTitle'} flex={2}>
              Regenereaza index cautare
            </Typography>
          </Tooltip>
        </Button>
      </Stack>
    </DashboardPage>
  )
}
