import React, { useCallback, useEffect } from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { EntityType, ReportSectionAPIInput } from 'defs'
import { useDebouncedMap } from '../../../utils/hooks/useMap'
import { useDialog } from '../../dialog/dialogProvider'
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
  const { uid, entries, values, add, remove, update } = useDebouncedMap(1000, sections)
  const addSection = useCallback(() => add({ name: '', content: [] }), [uid])

  useEffect(() => {
    updateSections(Array.from(values()))
  }, [uid])

  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
        <Typography variant={'h5'}>Sectiuni</Typography>
        <Tooltip title={'Creaza o sectiune de raport'}>
          <IconButton onClick={addSection}>
            <AddOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={'Sterge sectiunea de raport'}>
          <IconButton onClick={addSection}>
            <AddOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box>
        {entries().map(([uid, sectionInfo]) => (
          <ReportSection
            key={uid}
            entityId={entityId}
            entityType={entityType}
            sectionInfo={sectionInfo}
            updateSectionInfo={(sectionInfo) => update(uid, sectionInfo)}
            removeSection={() => remove(uid)}
          />
        ))}
      </Box>
    </Box>
  )
}
