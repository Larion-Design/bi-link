import React from 'react'
import Box from '@mui/material/Box'
import { GraphAPI } from 'defs'
import { Graph } from '../../../entityViews/graph'
import { InputField } from '../../inputField'

type Props = {
  entityId?: string
  graphInfo: GraphAPI
  updateGraph: (graphInfo: GraphAPI) => void
}

export const ReportContentGraph: React.FunctionComponent<Props> = ({
  entityId,
  graphInfo: { label },
  updateGraph,
}) => (
  <Box sx={{ width: 1 }}>
    <InputField label={'Titlu'} value={label} onChange={(label) => updateGraph({ label })} />
    {!!entityId && <Graph entityId={entityId} />}
  </Box>
)
