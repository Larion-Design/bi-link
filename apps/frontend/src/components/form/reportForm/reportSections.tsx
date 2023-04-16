import Stack from '@mui/material/Stack'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Grid from '@mui/material/Grid'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CallToActionIcon from '@mui/icons-material/CallToAction'
import { EntityType, ReportSectionAPIInput } from 'defs'
import { CreateDataRefHandler } from '../../../utils/hooks/useDataRefProcessor'
import { useDebouncedMap } from '../../../utils/hooks/useMap'
import { ActionButton } from '../../button/actionButton'
import { ReportDrawer } from '../../entityViews/reports/reportDetails/reportDrawer'
import { ReportSection } from './reportSection'

type Props<T = ReportSectionAPIInput> = {
  sections: T[]
  updateSections: (sections: T[]) => void | Promise<void>
  entityId?: string
  entityType?: EntityType
  generateTextPreview: (text: string) => string
  createDataRef: CreateDataRefHandler
  graphCreated: (graphId: string) => void
  graphRemoved: (graphId: string) => void
}

export const ReportSections: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  sections,
  updateSections,
  generateTextPreview,
  createDataRef,
  graphCreated,
  graphRemoved,
}) => {
  const { uid, entries, values, add, remove, update, map, keys, size } = useDebouncedMap(
    1000,
    sections,
  )
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const addSection = useCallback(() => add({ name: 'Capitol nou', content: [] }), [uid])

  useEffect(() => {
    if (!activeSection) {
      const sectionsIds = keys()

      if (sectionsIds.length) {
        setActiveSection(sectionsIds[0])
      }
    }
    updateSections(Array.from(values()))
  }, [uid])

  const closeDrawer = useCallback(() => setOpen(false), [setOpen])
  const openDrawer = useCallback(() => setOpen(true), [setOpen])
  const activeSectionInfo = useMemo(() => map.get(activeSection), [activeSection])

  return (
    <Box>
      {open && (
        <ReportDrawer
          entityId={entityId}
          entityType={entityType}
          createDataRef={createDataRef}
          closeDrawer={closeDrawer}
        />
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

      {!!size && !!activeSection && map.has(activeSection) && (
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
              {entries().map(([uid, { name }]) => (
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
              <ReportSection
                entityId={entityId}
                entityType={entityType}
                sectionInfo={activeSectionInfo}
                updateSectionInfo={(sectionInfo) => update(activeSection, sectionInfo)}
                removeSection={() => remove(activeSection)}
                generateTextPreview={generateTextPreview}
                graphCreated={graphCreated}
                graphRemoved={graphRemoved}
              />
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  )
}
