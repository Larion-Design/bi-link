import Stack from '@mui/material/Stack'
import React, { useCallback, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CallToActionIcon from '@mui/icons-material/CallToAction'
import { EntityType } from 'defs'
import { useReportState } from '../../../state/report/reportState'
import { ActionButton } from '../../button/actionButton'
import { ReportDrawer } from '../../entityViews/reports/reportDetails/reportDrawer'
import { ReportSection } from './reportSection'

type Props = {
  entityId?: string
  entityType?: EntityType
}

export const ReportSections: React.FunctionComponent<Props> = ({ entityId, entityType }) => {
  const { sections, addSection } = useReportState()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!activeSection && sections.size) {
      setActiveSection(Array.from(sections.keys()).at(0))
    }
  }, [sections])

  const closeDrawer = useCallback(() => setOpen(false), [setOpen])
  const openDrawer = useCallback(() => setOpen(true), [setOpen])
  const activeSectionInfo = sections.get(activeSection)

  return (
    <Box>
      {open && (
        <ReportDrawer entityId={entityId} entityType={entityType} closeDrawer={closeDrawer} />
      )}
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant={'h5'}>Capitole</Typography>

        <Stack direction={'row'} alignItems={'center'} spacing={2} mb={4}>
          <ActionButton
            label={'Creaza capitol'}
            icon={<AddOutlinedIcon color={'primary'} />}
            onClick={addSection}
          />

          <ActionButton
            disabled={!entityId && !entityType}
            label={'Cauta informatii'}
            icon={<CallToActionIcon />}
            onClick={openDrawer}
          />
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Tabs
            indicatorColor={'primary'}
            selectionFollowsFocus
            orientation={'vertical'}
            value={activeSection}
            onChange={(event, newValue) => setActiveSection(newValue)}
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            {Array.from(sections.entries()).map(([uid, { name }]) => (
              <Tab
                key={uid}
                value={uid}
                label={name}
                onClick={() => setActiveSection(uid)}
                sx={{ fontWeight: activeSection === uid ? 'bold' : 'inherit' }}
                color={activeSection === uid ? 'primary' : 'inherit'}
              />
            ))}
          </Tabs>
        </Grid>
        {!!activeSectionInfo && (
          <Grid item xs={10}>
            <ReportSection entityId={entityId} entityType={entityType} sectionId={activeSection} />
          </Grid>
        )}
      </Grid>
    </Box>
  )
}
