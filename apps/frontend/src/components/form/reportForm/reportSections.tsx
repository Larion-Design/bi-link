import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import TabPanel from '@mui/lab/TabPanel'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { EntityType, ReportSectionAPIInput } from 'defs'
import { useDebouncedMap } from '../../../utils/hooks/useMap'
import { ActionButton } from '../../button/actionButton'
import { ReportSection } from './reportSection'

type Props = {
  entityId?: string
  entityType?: EntityType
  sections: ReportSectionAPIInput[]
  updateSections: (sections: ReportSectionAPIInput[]) => void | Promise<void>
}

export const ReportSections: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  sections,
  updateSections,
}) => {
  const { uid, entries, values, keys, add, remove, update } = useDebouncedMap(1000, sections)
  const addSection = useCallback(() => add({ name: '', content: [] }), [uid])
  const [activeSection, setActiveSection] = useState(() => keys()[0] ?? '')

  useEffect(() => {
    updateSections(Array.from(values()))
  }, [uid])

  const sectionsList = useMemo(() => entries(), [uid])

  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
        <Typography variant={'h5'}>Sectiuni</Typography>
        <ActionButton
          label={'Creaza o sectiune de raport'}
          icon={<AddOutlinedIcon />}
          onClick={addSection}
        />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Tabs
          orientation={'vertical'}
          variant={'scrollable'}
          value={activeSection}
          onChange={(event, newValue) => setActiveSection(newValue)}
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          {sectionsList.map(([uid, { name }]) => (
            <Tab value={uid} key={uid} label={name} />
          ))}
        </Tabs>
        {sectionsList.map(([uid, sectionInfo]) => (
          <TabPanel value={uid} key={uid}>
            <ReportSection
              entityId={entityId}
              entityType={entityType}
              sectionInfo={sectionInfo}
              updateSectionInfo={(sectionInfo) => update(uid, sectionInfo)}
              removeSection={() => remove(uid)}
            />
          </TabPanel>
        ))}
      </Box>
    </Box>
  )
}
